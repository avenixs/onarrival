const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const Question = sequelize.define('Question', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    questionEnglish: {
        type: Sequelize.STRING,
        allowNull: false
    },
    questionForeign: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Question;