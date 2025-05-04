//const {Sequelize, DataTypes} = require("sequelize");

// const generateGames = (nrFakeEntities) => {
//
//     for (let i = 0; i < nrFakeEntities; i++) {
//         // TO DO WHEN CHANGING CURRENT DATABASE
//     }
// }
//
// const sequelize = new Sequelize(process.env.DATABASE_URL);
//
// const games = sequelize.define('GAMES', {
//     id: {
//         type: DataTypes.DECIMAL,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     releaseDate: {
//         type: DataTypes.DATE,
//         allowNull: false,
//     },
//     price: {
//         type: DataTypes.DECIMAL,
//         allowNull: false,
//     }
// });
//
// const gamesAndDescriptions = sequelize.define('GAMES_AND_DESCRIPTION', {
//     game_id: {
//         type: DataTypes.DECIMAL,
//         foreignKey: true,
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// });
//
// const gamesAndImages = sequelize.define('GAMES_AND_IMAGE', {
//     game_id: {
//         type: DataTypes.DECIMAL,
//         foreignKey: true,
//     },
//     image: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// });
//
// const gamesAndTags = sequelize.define('GAMES_AND_TAG', {
//     game_id: {
//         type: DataTypes.DECIMAL,
//         foreignKey: true,
//     },
//     tag: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// });
