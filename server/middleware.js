const path = require("node:path");
const fileUpload = require("express-fileupload");

const MB = 2048;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const filesPayloadExists = (req, res, next) => {
    if (!req.files) return res.status(400).json({ status: "error", message: "Missing uploadedFiles" });
    next();
}

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

module.exports = {
    fileExtLimiter,
    filesPayloadExists,
    fileUpload,
    fileSizeLimiter,
}