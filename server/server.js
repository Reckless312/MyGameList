require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { z } = require('zod');

const app = express();
const port = process.env.PORT || 8080;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://my-game-list-sand.vercel.app']
    : ['http://localhost:3000', 'https://www.google.com', 'http://localhost:8080'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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
            client = await pool.connect();
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
            const validation = gameSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation for input failed!' });
            }

            const { name, description, image, releaseDate, price, tag } = req.body;

            if (name === undefined || description === undefined || image === undefined || releaseDate === undefined || price === undefined || tag === undefined)
            {
                return res.status(404).json({ message: 'Missing required fields' });
            }

            client = await pool.connect();

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
            const { id } = req.body;

            if (id === undefined)
            {
                return res.status(400).json({ message: 'Game id required' });
            }

            client = await pool.connect();

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
            const validation = gameSchema.safeParse(req.body);

            console.log(req.body);

            if (!validation.success) {
                return res.status(400).json({ message: 'Validation for input failed!' });
            }

            const {id, name, description, image, releaseDate, price, tag } = req.body;

            if (id === undefined || name === undefined || description === undefined || image === undefined || releaseDate === undefined || price === undefined || tag === undefined)
            {
                return res.status(401).json({ message: 'Missing required fields' });
            }

            client = await pool.connect();

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
            const { name } = req.body;
            if (name === undefined) {
                return res.status(404).json({ message: 'Missing required fields' });
            }

            client = await pool.connect();
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
            client = await pool.connect();
            const result = await client.query('SELECT * FROM games ORDER BY name');
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: 'Error happened while retrieving games' });
        }
        finally {
            client?.release();
        }
    })

module.exports = app;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});