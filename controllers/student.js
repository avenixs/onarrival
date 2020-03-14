const EnterpriseUser = require("../models/enterprise-user");
const StudentUser = require("../models/student-user");
const Company = require("../models/company");
const Course = require("../models/course");
const Chapter = require("../models/chapter");
const VocabExercise = require("../models/vocab-exercise");
const Word = require("../models/word");
const bcrypt = require("bcryptjs");

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