const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const Article = sequelize.define('Article', {
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
    textEnglish: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    textForeign: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    isCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Article;