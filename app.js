const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()

// Import of packages used in the entry file
const fs = require(fs);
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
const Score = require("./models/score");
const Chapter = require("./models/chapter");
const Company = require("./models/company");
const Course = require("./models/course");
const Question = require("./models/question");
const Recording = require("./models/recording");
const Word = require("./models/word");
const ComprehensionExercise = require("./models/comprehension-exercise");
const VocabExercise = require("./models/vocab-exercise");
const StudyMaterial = require("./models/study-material");

// The main Express.js application
const app = express();

// Setting the templating engine to EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware that uses body-parser to parse the key-value pairs from the incoming request
app.use(bodyParser.urlencoded({extended: false}));

// To expose the files in the "public" folder and grant the READ access to stylesheets, media and scripts
app.use(express.static(path.join(__dirname, 'public')));

// Enabling sessions for the application
app.use(cookieParser());
app.use(
    session({
        secret: "languageonarrival westminster", 
        resave: false, 
        proxy: true,
        saveUninitialized: false,
        store: new sequelizeStore({
            db: sequelize
        })
    })
);

app.use("/", publicRoutes);

// Relationships between the models
EnterpriseUser.belongsTo(Company);
EnterpriseUser.belongsTo(Course);
Course.belongsTo(Company);
ComprehensionExercise.belongsTo(EnterpriseUser);
VocabExercise.belongsTo(EnterpriseUser);
ComprehensionExercise.belongsTo(Chapter);
VocabExercise.belongsTo(Chapter);
Chapter.belongsTo(Course);
Question.belongsTo(ComprehensionExercise);
Question.hasMany(Answer);
Answer.belongsTo(Question);
Word.belongsTo(VocabExercise);
Word.hasOne(Recording);
StudentUser.belongsTo(Course);
StudentUser.belongsTo(Company);
StudyMaterial.belongsTo(Chapter);
Score.belongsTo(StudentUser);
Score.belongsTo(ComprehensionExercise);

try {
    fs.mkdirSync(path.join(__dirname, 'public', "recordings"))
} catch(error) {
    console.log(error);
}

// This is a dynamic port allocation for Heroku deployment
const PORT = process.env.PORT || 3025;
app.listen(PORT);