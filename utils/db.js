const Sequelize = require("sequelize");

const sequelize = new Sequelize("heroku_bd9a9d27abffc69", "bc4f3deba845b7", "92a63f6c", {
    dialect: "mysql",
    host: "eu-cdbr-west-02.cleardb.net"
});

module.exports = sequelize;