const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const Verification = sequelize.define('Verification', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    EnterpriseUserId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    VerificationCode: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

module.exports = Verification;