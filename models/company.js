const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const Company = sequelize.define('Company', {
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
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telNum: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Company;