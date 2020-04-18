const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const Recognition = sequelize.define('recognition', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    WordId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    StudentUserId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Recognition;