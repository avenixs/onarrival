const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const Word = sequelize.define('Word', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    wordEnglish: {
        type: Sequelize.STRING,
        allowNull: false
    },
    wordForeign: {
        type: Sequelize.STRING,
        allowNull: false
    },
    exSentenceEng: {
        type: Sequelize.STRING,
        allowNull: false
    },
    exSentenceForeign: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isRemembered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Word;