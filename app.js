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

// Imports of models used to establish relationships between them
const EnterpriseUser = require("./models/enterprise-user");
const StudentUser = require("./models/student-user");
const Answer = require("./models/answer");
const Article = require("./models/article");
const Chapter = require("./models/chapter");
const Company = require("./models/company");
const Course = require("./models/course");
const Question = require("./models/question");
const Quiz = require("./models/quiz");
const Recording = require("./models/recording");
const Word = require("./models/word");
const ListeningExercise = require("./models/listening-exercise");
const ReadingExercise = require("./models/reading-exercise");
const VocabExercise = require("./models/vocab-exercise");

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
        secret: "languageonarrival westminster", 
        resave: false, 
        proxy: true,
        saveUninitialized: false,
        store: new sequelizeStore({
            db: sequelize
        }),
        //cookie: {}
    })
);

app.use("/", publicRoutes);

// Relationships between the models
EnterpriseUser.belongsTo(Company);
ListeningExercise.belongsTo(EnterpriseUser);
ReadingExercise.belongsTo(EnterpriseUser);
VocabExercise.belongsTo(EnterpriseUser);
ListeningExercise.belongsTo(Chapter);
ReadingExercise.belongsTo(Chapter);
VocabExercise.belongsTo(Chapter);
Chapter.belongsTo(Course);
ListeningExercise.hasMany(Recording);
Article.belongsTo(ReadingExercise);
Article.hasMany(Recording);
Article.hasMany(Question);
ListeningExercise.hasMany(Question);
Question.hasMany(Answer);
Quiz.belongsTo(VocabExercise);
Quiz.hasMany(Word);
Word.hasOne(Recording);
StudentUser.belongsTo(Course);
StudentUser.belongsTo(Company);

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