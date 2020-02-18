const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const Answer = sequelize.define('Answer', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    answerEnglish: {
        type: Sequelize.STRING,
        allowNull: false
    },
    answerForeign: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isCorrect: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Answer;