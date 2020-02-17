const express = require('express');
const bodyParser = require('body-parser');

// Import of packages used in the entry file
const sequelize = require("./utils/db");
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser')
const sequelizeStore = require('connect-session-sequelize')(session.Store);

// Import of routes; UPDATE: One route for all users
const publicRoutes = require("./routes/public");

// Importing the authentication middleware that will be executed before the actual one
const isLoggedIn = require("./middleware/logged-in");
const notLoggedIn = require("./middleware/not-logged-in");

// Imports of models used to establish relationships between them
const EnterpriseUser = require("./models/enterprise-user");

// The main Express.js application
const app = express();

// Setting the templating engine to EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware that uses body-parser to parse the key-value pairs from the incoming request
app.use(bodyParser.urlencoded({extended: false}));

// To expose the files in the "public" folder and grant the READ access to stylesheets, media and scripts
app.use(express.static(path.join(__dirname, 'public')));

// Initializing a session
app.use(cookieParser());
app.use(
    session({
        secret: "languageonarrivalwestminster", 
        resave: false, 
        proxy: true,
        saveUninitialized: false,
        store: new sequelizeStore({
            db: sequelize
        }),
        //cookie: {}
    })
);

app.use("/", isLoggedIn, publicRoutes);

// This is a dynamic port allocation for Heroku deployment
const PORT = process.env.PORT || 3025;
app.listen(PORT);

/* sequelize.sync({force:true})
    .then(result => {
        app.listen(PORT);
    })
    .catch(error => {
        console.log(error);
    }); */