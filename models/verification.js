const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const Verification = sequelize.define('Verification', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    VerificationCode: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

module.exports = Verification;