const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const StudyMaterial = sequelize.define('StudyMaterial', {
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
    fileName: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = StudyMaterial;