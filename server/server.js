require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const cors = require('cors');
const { z } = require('zod');
const {getPool} = require("./util/database");
const fileUpload = require("express-fileupload");
const path = require("node:path");
const {readdir} = require("node:fs");
const fs = require("node:fs");

const app = express();
const port = 8080;

const allowedOrigins = ['http://localhost:3000', 'https://www.google.com', 'http://localhost:8080'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const gameSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    image: z.string().url(),
    releaseDate: z.string().date(),
    price: z.number().nonnegative().max(99.99),
    tag: z.string().min(3),
});

app.route('/api/games')
    .get(async (req, res) => {
        let client;
        try {
            client = await getPool().connect();
            const result = await client.query('SELECT * FROM games');
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: 'Error happened while retrieving games' });
        }
        finally {
            client?.release();
        }
    })
    .post(async (req, res) => {
        let client;
        try {
            if (req.body === undefined || req.body?.name === undefined || req.body?.description === undefined || req.body?.image === undefined || req.body?.releaseDate === undefined || req.body?.price === undefined || req.body?.tag === undefined)
            {
                return res.status(404).json({ message: 'Missing required fields' });
            }

            const validation = gameSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation for input failed!' });
            }

            const { name, description, image, releaseDate, price, tag } = req.body;

            client = await getPool().connect();

            const existing = await client.query('SELECT id FROM games WHERE name = $1', [name]);

            if (existing.rowCount > 0) {
                return res.status(401).json({ message: 'Game already found with same critical information' });
            }

            await client.query(`INSERT INTO games (name, description, image, "releaseDate", price, tag) VALUES ($1, $2, $3, $4, $5, $6)`, [name, description, image, releaseDate, price, tag]);

            res.status(200).json({ message: 'Game created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error happened while creating game' });
        }
        finally {
            client?.release();
        }
    }).delete(async (req, res) => {
        let client;
        try {

            if (req.body === undefined)
            {
                return res.status(400).json({ message: 'Game id required' });
            }

            const { id } = req.body;

            client = await getPool().connect();

            const existing = await client.query('SELECT * FROM games WHERE id = $1', [id]);

            if (existing.rowCount === 0) {
                return res.status(401).json({ message: 'Game id not found!' });
            }

            await client.query('DELETE FROM games WHERE id = $1', [id]);

            res.json({ message: 'Game deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error happened while deleting game' });
        }
        finally {
            client?.release();
        }
})
    .patch(async (req, res) => {
        let client;
        try {
            const validation = gameSchema.passthrough().safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({ message: 'Validation for input failed!' });
            }

            if (req.body === undefined || req.body?.id === undefined || req.body?.name === undefined || req.body?.description === undefined || req.body?.image === undefined || req.body?.releaseDate === undefined || req.body?.price === undefined || req.body?.tag === undefined)
            {
                return res.status(401).json({ message: 'Missing required fields' });
            }

            const {id, name, description, image, releaseDate, price, tag } = req.body;

            client = await getPool().connect();

            const existing = await client.query('SELECT * FROM games WHERE id = $1', [id]);

            if (existing.rowCount === 0) {
                return res.status(402).json({ message: 'Game id not found!' });
            }

            const nameCheck = await client.query('SELECT id FROM games WHERE name = $1 AND id != $2', [name, id]);

            if (nameCheck.rowCount > 0) {
                return res.status(403).json({ message: 'Game already found with same critical information' });
            }

            await client.query(`UPDATE games SET name = $1, description = $2, image = $3, "releaseDate" = $4, price = $5, tag = $6 WHERE id = $7`, [name, description, image, releaseDate, price, tag, id]);

            res.json({ message: 'Game updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error happened while updating the game' });
        }
        finally {
            client?.release();
        }
    });

app.route('/api/games/filter')
    .post(async (req, res) => {
        let client;
        try {
            if (req.body === undefined || req.body?.name === undefined) {
                return res.status(404).json({ message: 'Missing required fields' });
            }

            const { name } = req.body;

            client = await getPool().connect();
            const result = await client.query(`SELECT * FROM games WHERE LOWER(name) LIKE '%' || LOWER($1) || '%'`, [name]);

            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: 'Error happened while filtering games' });
        }
        finally {
            client?.release();
        }
});

app.route('/api/games/sort')
    .get(async (req, res) => {
        let client;
        try {
            client = await getPool().connect();
            const result = await client.query('SELECT * FROM games ORDER BY name');
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: 'Error happened while retrieving games' });
        }
        finally {
            client?.release();
        }
    })

const filesPayloadExists = (req, res, next) => {
    if (!req.files) return res.status(400).json({ status: "error", message: "Missing files" });
    next();
}

const MB = 2048;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
    const files = req.files;

    const filesOverLimit = [];

    Object.keys(files).forEach(key => {
        if (files[key].size > FILE_SIZE_LIMIT) {
            filesOverLimit.push(files[key].name);
        }
    })

    if (filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? 'are' : 'is';

        const sentence = `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file
        size limit of ${MB} MB.`.replaceAll(",", ", ");

        const message = filesOverLimit.length < 3
        ? sentence.replace(",", " and")
        : sentence.replace(/, (?=[^,]*$)/, " and");

        return res.status(413).json({status: "error", message});
    }

    next();
}

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        const files = req.files;

        const fileExtensions = [];

        Object.keys(files).forEach(key => {
            fileExtensions.push(path.extname(files[key].name));
        })

        const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext));

        if(!allowed){
            const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(",", ", ");

            return res.status(422).json({status: "error", message});
        }

        next();
    }
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/upload', fileUpload({createParentPath: true}), filesPayloadExists, fileExtLimiter(['.png', '.jpg', 'jpeg', '.mkv']), fileSizeLimiter, (req, res) => {
    const files = req.files;

    Object.keys(files).forEach(key => {
        const filepath = path.join(__dirname, 'files', files[key].name);
        files[key].mv(filepath, (err) => {
            if (err) return res.status(500).json({status: "error", message: err});
        });
    })

    return res.json({status: "success", message: Object.keys(files).toString()});
});

app.get('/files', (req, res) => {
    const fileDirectory = path.join(__dirname, 'files');

    readdir(fileDirectory, (_, fileDirectory) => {
        console.log(fileDirectory);

        return res.json({status: "success", files: fileDirectory});
    })
});

app.get('/download', (req, res) => {
    const file = req.query;

    console.log(file.file);

    const filePath = path.join(__dirname, 'files', file.file);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    }
    else{
        res.status(404).json({ message: 'File not found!' });
    }
})

module.exports = app;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});