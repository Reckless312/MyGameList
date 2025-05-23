const {Sequelize, DataTypes} = require("sequelize");
const {Op} = require("@sequelize/core")
const {faker} = require("@faker-js/faker")
const {randomInt} = require("node:crypto");
const {gameTitles, imageUrls, uniqueGameTags, gameDescriptions} = require("../videogames")

async function generateEntities(size){
    for (let i = 0; i < size; i++) {
        // Faker sucks so I am hardcoding, also there shouldn't be games with same name or others identical
        // Should be unique if only ran once on a clean database
        const name = gameTitles[randomInt(0, gameTitles.length)] + " " + faker.book.title() + " " + i.toString();
        const releaseDate = faker.date.past({years: 34}).toISOString().split('T')[0];
        const price = faker.number.float({min: 0, max: 100, multipleOf: 0.5}).toFixed(2);
        const tag = uniqueGameTags[randomInt(0, uniqueGameTags.length)];
        const description = gameDescriptions[randomInt(0, gameDescriptions.length)] + " " + faker.word.sample() + " " + i.toString();
        const image = imageUrls[randomInt(0, imageUrls.length)]

        try{
            await createNewGame(name, description, image, tag, price, releaseDate);
        }catch{
        }

        console.log(i);
    }
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {logging: false});

const Game = sequelize.define('GAME', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        index: true,
    },
    releaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    tag: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

const GameDescription = sequelize.define('GAME_DESCRIPTION', {
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

const GameImage = sequelize.define('GAME_IMAGE', {
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
});

Game.hasMany(GameDescription, {
    foreignKey: 'gameId',
    onDelete: 'CASCADE',
});
GameDescription.belongsTo(Game);

Game.hasMany(GameImage, {
    foreignKey: 'gameId',
    onDelete: 'CASCADE',
});
GameImage.belongsTo(Game);

async function connectToDatabase() {
    try{
        await sequelize.authenticate();
    }
    catch(error){
        console.error(error);
    }
}

async function initializeTables(){
    try{
        await sequelize.sync();
    }
    catch(error){
        console.error(error);
    }
}

async function returnGames(lastId){
    const games = await Game.findAll({
        where: {id: {[Op.gt]: lastId}},
        include: [{model: GameDescription, attributes: ['description'], limit: 1}, {model: GameImage, attributes: ['image'], limit: 1}], limit: 100});
    return {games, id: games.length ? games[games.length - 1].id : null};
}

async function findGameIdByName(name){
    return await Game.findOne({
        where: {
            name: name
        },
        attributes: ['id']
    })
}

async function createNewGame(name, description, image, tag, price, releaseDate){

    await Game.create({
        name: name,
        releaseDate: releaseDate,
        price: price,
        tag: tag
    })

    const addedGame = await findGameIdByName(name);

    await GameImage.create({
        image: image,
        gameId: addedGame.id
    })

    await GameDescription.create({
        description: description,
        gameId: addedGame.id
    })
}

async function findGameById(id){
    return await Game.findOne({
        where: {
            id: id
        },
        include: [{model: GameDescription, attributes: ['description'], limit: 1}, {model: GameImage, attributes: ['image'], limit: 1}]
    })
}

async function deleteGameById(id){
    await Game.destroy({
        where: {id}
    })
}

async function findGameByNameWithDifferentId(name, id){
    return await Game.findOne({
        where: {
            name: name,
            id: {[Op.ne]: id}
        },
        attributes: ['id'],
        include: [{model: GameDescription, attributes: ['description'], limit: 1}, {model: GameImage, attributes: ['image'], limit: 1}]
    })
}

async function getMaximumId() {
    const id = await sequelize.query(
        'SELECT MAX(id) FROM public."GAMEs"',
    );
    return Number(id[0][0].max);
}

async function updateGame(id, name, description, image, tag, price, releaseDate){
    await Game.update({
        name: name,
        releaseDate: releaseDate,
        tag: tag,
        price: price,
    }, {
        where: {id: id}
    })

    const gameImage = await GameImage.findOne({
        where: {gameId: id}
    })

    const gameDescription = await GameDescription.findOne({
        where: {gameId: id}
    })

    await GameImage.upsert({image: image, id: gameImage.id});
    await GameDescription.upsert({description: description, id: gameDescription.id});
}

async function findGamesByName(name){
    return await Game.findAll({
        where: {
            name: {
                [Op.iLike]: `%${name}%`
            }
        },
        include: [{model: GameDescription, attributes: ['description'], limit: 1}, {model: GameImage, attributes: ['image'], limit: 1}], limit: 100
    })
}

async function getGamesOrderedByAttribute(lastId, attribute, sortingCode){
    const games = await Game.findAll({
        where: {id: {[Op.gt]: lastId}},
        order: [[attribute, getSortingOrder(sortingCode)]],
        include: [{model: GameDescription, attributes: ['description'], limit: 1}, {model: GameImage, attributes: ['image'], limit: 1}], limit: 100})
    return {games, id: games.length ? games[games.length - 1].id : null};
}

function getSortingOrder(sortingCode){
    let sortingOrder;
    switch(sortingCode){
        case true:
            sortingOrder = 'ASC';
            break;
        case false:
            sortingOrder = 'DESC';
            break;
    }
    return sortingOrder;
}

module.exports = {
    connectToDatabase, initializeTables, returnGames, findGameIdByName, createNewGame, findGameById, deleteGameById, findGameByNameWithDifferentId,
    updateGame, findGamesByName, getGamesOrderedByAttribute, generateEntities, getMaximumId
}