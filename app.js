const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const session = require("express-session");
const cookieParser = require("cookie-parser")
const sequelizeStore = require("connect-session-sequelize")(session.Store);

const sequelize = require("./utils/db");
const { createAssociations } = require("./models/associations");
createAssociations();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
exports.sgMail = sgMail;

const publicRoutes = require("./routes/public");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET, 
        resave: false, 
        proxy: true,
        saveUninitialized: false,
        store: new sequelizeStore({
            db: sequelize
        })
    })
);

app.use("/", publicRoutes);

try {
    fs.mkdirSync(path.join(__dirname, "public", "recordings"));
} catch(error) { console.log("The folder exists") }

const PORT = process.env.PORT || 3025;
app.listen(PORT);