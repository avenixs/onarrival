const EnterpriseUser = require("../models/enterprise-user");
const Company = require("../models/company");
const Course = require("../models/course");
const Chapter = require("../models/chapter");
const VocabExercise = require("../models/vocab-exercise");
const Word = require("../models/word");
const bcrypt = require("bcryptjs");

exports.getAddChapterPage = async (req, res, next) => {
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const course = await Course.findOne({ where: { id: user.CourseId } });

    const allChapters = await Chapter.findAll({ where: { CourseId: course.id } })
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/add-chapter", {
        pageTitle: "Add a New Chapter",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        course: course,
        chapters: allChapters,
        accountData: accountData
    }); 
};

exports.addChapter = async (req, res, next) => {
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const course = await Course.findOne({ where: { id: user.CourseId } });

    Chapter.create({
        title: req.body.title,
        number: req.body.number,
        theme: req.body.theme,
        description: req.body.description 
    })
        .then(async addedChapter => {
            await addedChapter.setCourse(course);

            return res.redirect("/enterprise/courses/chapters/add?success=true");

        })
        .catch(error => { console.log(error); })
};

exports.getAddVocabExercisePage = async (req, res, next) => {
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const course = await Course.findOne({ where: { id: user.CourseId } });

    const allChapters = await Chapter.findAll({ where: { CourseId: course.id } })
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/add-vocab-ex", {
        pageTitle: "Add a New Vocabulary Exercise",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        course: course,
        chapters: allChapters,
        accountData: accountData
    }); 
};

exports.getVocabExPerChapter = (req, res, next) => {
    VocabExercise.findAll( { where: { ChapterId: req.query.id }} )
        .then(vocEx => {
            let vocExData = [];
            for(let i=0; i<vocEx.length; i++) {
                let exercise = {
                    id: vocEx[i].id,
                    name: vocEx[i].name,
                    type: vocEx[i].type,
                    level: vocEx[i].level,
                    description: vocEx[i].description
                };
                vocExData.push(exercise);
            };
            res.status(201).json({
                exercises: vocExData
            });
        })
        .catch(error => { console.log(error); })
}

exports.addNewVocabExercise = async (req, res, next) => {
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const chapter = await Chapter.findOne({ where: { id: req.body.chapterSelected } });

    VocabExercise.create({
        name: req.body.name,
        type: req.body.type,
        level: req.body.level,
        description: req.body.description 
    })
        .then(async addEx => {
            await addEx.setChapter(chapter);
            await addEx.setEnterpriseUser(user);

            return res.redirect("/enterprise/exercises/vocab/add?success=true");

        })
        .catch(error => { console.log(error); })
};

exports.getManageVocabExPage = async (req, res, next) => {
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const course = await Course.findOne({ where: { id: user.CourseId } });

    const allChapters = await Chapter.findAll({ where: { CourseId: course.id } });
    const allVocabEx = await VocabExercise.findAll({ where: { EnterpriseUserId: user.id } })
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/manage-vocab-ex", {
        pageTitle: "Manage Vocabulary Exercises",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        course: course,
        chapters: allChapters,
        exercises: allVocabEx,
        accountData: accountData
    }); 
};

exports.getWordsFromExercise = async (req, res, next) => {
    const words = await Word.findAll({ where: { VocabExerciseId: req.query.id } });

    res.status(201).json({
        words: words
    });
};

exports.addNewWord = async (req, res, next) => {
    const exercise = await VocabExercise.findOne({ where: { id: req.query.vocabExId } });

    res.status(201).json({
        success: true
    });

    Word.create({
        wordEnglish: req.query.wordEng,
        wordForeign: req.query.wordFor,
        exSentenceEng: req.query.exSentEng,
        exSentenceForeign: req.query.exSentForeign
    })
        .then(word => {
            word.setVocabExercise(exercise);
        })
        .catch(error => { 
            console.log(error);
        })
};

exports.updateWord = async (req, res, next) => {
    const word = await Word.findOne({ where: { id: req.query.wordId } });

    res.status(201).json({
        success: true
    });

    word.wordEnglish = req.query.wordEng;
    word.wordForeign = req.query.wordForeign;
    word.exSentenceEng = req.query.sentEng;
    word.exSentenceForeign = req.query.sentFor;
    word.save();
};