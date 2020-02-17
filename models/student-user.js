const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const StudentUser = sequelize.define('StudentUser', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    surname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    disabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = StudentUser;