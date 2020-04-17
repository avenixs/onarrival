const Sequelize = require('sequelize');
const sequelize = require("../utils/db");

const ComprehensionExercise = sequelize.define('ComprehensionExercise', {
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
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    textEng: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    textFor: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    isCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    file: {
        type: Sequelize.STRING,
        allowNull: true
    },
    disabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = ComprehensionExercise;