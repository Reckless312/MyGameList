const {Sequelize, DataTypes} = require("sequelize");
const {Op} = require("@sequelize/core")

// const generateGames = (nrFakeEntities) => {
//
//     for (let i = 0; i < nrFakeEntities; i++) {
//         // TO DO WHEN CHANGING CURRENT DATABASE
//     }
// }

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

async function returnGames(){
    return await Game.findAll({include: [{model: GameDescription}, {model: GameImage}]});
}

async function findGameByName(name){
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

    const addedGame = await findGameByName(name);

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
        attributes: ['id'],
        include: [{model: GameDescription}, {model: GameImage}]
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
        include: [{model: GameDescription}, {model: GameImage}]
    })
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
        include: [{model: GameDescription}, {model: GameImage}]
    })
}

async function getGamesOrderedByName(){
    return await Game.findAll({
        order: [['name', 'ASC']],
        include: [{model: GameDescription}, {model: GameImage}]
    })
}

module.exports = {
    Game, GameImage, GameDescription, connectToDatabase, initializeTables, returnGames, findGameByName, createNewGame, findGameById,
    deleteGameById, findGameByNameWithDifferentId, updateGame, findGamesByName, getGamesOrderedByName
}