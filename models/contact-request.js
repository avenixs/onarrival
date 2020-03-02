const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const ContactRequest = sequelize.define('ContactRequest', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    companyName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    companyEmail: {
        type: Sequelize.STRING,
        allowNull: false
    },
    companyTel: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mgrName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    mgrDepartment: {
        type: Sequelize.STRING,
        allowNull: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

module.exports = ContactRequest;