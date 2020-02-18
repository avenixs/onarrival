const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const ReadingExercise = sequelize.define('ReadingExercise', {
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
    level: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

module.exports = ReadingExercise;