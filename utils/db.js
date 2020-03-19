const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.CLEARDB_DB_NAME, process.env.CLEARDB_USERNAME, process.env.CLEARDB_PASSWORD, {
    dialect: "mysql",
    host: process.env.CLEARDB_HOST
});

module.exports = sequelize;