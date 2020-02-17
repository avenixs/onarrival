const Sequelize = require("sequelize");

const sequelize = new Sequelize("8GHVCtxnjy", "8GHVCtxnjy", "EFUccDBpCk", {
    dialect: "mysql",
    host: "remotemysql.com"
});

module.exports = sequelize;