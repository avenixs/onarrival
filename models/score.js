const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const Score = sequelize.define('score', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    pointsReceived: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pointsMax: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Score;