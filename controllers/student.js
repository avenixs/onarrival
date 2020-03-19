const EnterpriseUser = require("../models/enterprise-user");
const StudentUser = require("../models/student-user");
const Company = require("../models/company");
const Course = require("../models/course");
const Chapter = require("../models/chapter");
const VocabExercise = require("../models/vocab-exercise");
const Word = require("../models/word");
const bcrypt = require("bcryptjs");
const StudyMaterial = require("../models/study-material");

const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET_NAME;
aws.config = {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};
const s3 = new aws.S3();

const fs = require("fs");

exports.getPanelPage = async (req, res, next) => {
    const company = await Company.findOne({ where: { id: req.session.company.id } });
    const user = await StudentUser.findOne({ where: { id: req.session.userId } });
    
    res.render("panel/student-main", {
        pageTitle: "Main Panel",
        company: company,
        user: user,
        course: req.session.course,
        chapters: req.session.chapters
    });
};

exports.getChapterVocabEx = async (req, res, next) => {
    const company = await Company.findOne({ where: { id: req.session.company.id } });
    const user = await StudentUser.findOne({ where: { id: req.session.userId } });

    res.render("panel/chapter-vocab-ex", {
        pageTitle: "Vocabulary Exercises",
        company: company,
        user: user,
        course: req.session.course,
        chapters: req.session.chapters,
        vocabEx: req.vocabEx
    });
};

exports.getChapterLearningVocabEx = async (req, res, next) => {
    const company = await Company.findOne({ where: { id: req.session.company.id } });
    const user = await StudentUser.findOne({ where: { id: req.session.userId } });

    let listOfLearningEx = [];

    for(let i=0; i<req.vocabEx.length; i++) {
        if(req.vocabEx[i].type=="Learning") {
            listOfLearningEx.push(req.vocabEx[i]);
        }
    };

    res.render("panel/learning-vocab-ex", {
        pageTitle: "Learning Vocabulary Exercises",
        company: company,
        user: user,
        course: req.session.course,
        chapters: req.session.chapters,
        vocabEx: listOfLearningEx
    });
};

exports.getChapterQuizVocabEx = async (req, res, next) => {
    const company = await Company.findOne({ where: { id: req.session.company.id } });
    const user = await StudentUser.findOne({ where: { id: req.session.userId } });

    let listOfQuizEx = [];

    for(let i=0; i<req.vocabEx.length; i++) {
        if(req.vocabEx[i].type=="Quiz") {
            listOfQuizEx.push(req.vocabEx[i]);
        }
    };

    res.render("panel/quiz-vocab-ex", {
        pageTitle: "Quiz Exercises",
        company: company,
        user: user,
        course: req.session.course,
        chapters: req.session.chapters,
        vocabEx: listOfQuizEx
    });
};

exports.learningVocabEx = async (req, res, next) => {
    const company = await Company.findOne({ where: { id: req.session.company.id } });
    const user = await StudentUser.findOne({ where: { id: req.session.userId } });
    const exercise = await VocabExercise.findOne({ where: { id: req.exId } });

    res.render("panel/learning-ex-words", {
        pageTitle: "Quiz Exercises",
        company: company,
        user: user,
        course: req.session.course,
        chapters: req.session.chapters,
        exercise: exercise
    });
};

exports.findExerciseWords = async (req, res, next) => {
    const words = await Word.findAll({ where: { VocabExerciseId: req.query.id, isRemembered: 0 } });

    res.status(201).json({
        words: words
    });
};

exports.setWordRemembered = async (req, res, next) => {
    const word = await Word.findOne({ where: { id: req.query.id } });
    word.isRemembered = 1;
    word.save();

    res.status(201).json({
        remembered: true
    });
};

exports.getMaterialsPage = async (req, res) => {
    const company = await Company.findOne({ where: { id: req.session.company.id } });
    const user = await StudentUser.findOne({ where: { id: req.session.userId } });
    
    res.render("panel/view-materials", {
        pageTitle: "View Study Materials",
        company: company,
        user: user,
        course: req.session.course,
        chapters: req.session.chapters,
        materials: req.studyMaterials
    });
}

exports.downloadMaterial = async (req, res) => {
    var fileStream = fs.createWriteStream("files/" + req.body.nameOfFile);
    var s3Stream = s3.getObject({Bucket: S3_BUCKET, Key: req.body.nameOfFile}).createReadStream();

    s3Stream.on('error', function(err) {
        // NoSuchKey: The specified key does not exist
        console.error(err);
    });
    
    s3Stream.pipe(fileStream).on('error', function(err) {
        console.error('File Stream:', err);
    }).on('close', function() {
        res.download("files/" + req.body.nameOfFile);
    });
}