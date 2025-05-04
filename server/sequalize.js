const {Sequelize, DataTypes} = require("sequelize");

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
    }
});

const GameDescription = sequelize.define('GAME_DESCRIPTION', {
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

const GameImage = sequelize.define('GAME_IMAGE', {
    imageUrl: {
        type: DataTypes.TEXT,
        allowNull: false
    },
});

const GameTag = sequelize.define('GAME_TAG', {
    tag: {
        type: DataTypes.TEXT,
        primaryKey: true,
    }
});

Game.hasMany(GameDescription, {
    foreignKey: 'gameId',
});
GameDescription.belongsTo(Game);

Game.hasMany(GameImage, {
    foreignKey: 'gameId',
});
GameImage.belongsTo(Game);

Game.belongsToMany(GameTag, {
    through: 'GameTag',
    foreignKey: 'gameId',
    otherKey: 'tagId',
});
GameTag.belongsToMany(Game, {
    through: 'GameTag',
    foreignKey: 'tagId',
    otherKey: 'gameId'
});

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

module.exports = {
    Game, GameImage, GameDescription, GameTag, connectToDatabase, initializeTables
}