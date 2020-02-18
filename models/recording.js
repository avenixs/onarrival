const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const Recording = sequelize.define('Recording', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fileName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fileLocation: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Recording;