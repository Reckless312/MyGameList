const express = require('express');

const app = express();
const port = 8080;
const gamesRoute = require("./api/games");
const filesRoute = require("./api/files");
const cors = require("cors");

const allowedOrigins = ['http://localhost:3000', 'https://www.google.com', 'http://localhost:8080'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/games', gamesRoute);
app.use('/', filesRoute);

module.exports = app;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});