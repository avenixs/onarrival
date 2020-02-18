const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const Quiz = sequelize.define('Quiz', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    canBeRetaken: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    isCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Quiz;