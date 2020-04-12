const EnterpriseUser = require("../models/enterprise-user");
const Company = require("../models/company");
const Course = require("../models/course");
const Chapter = require("../models/chapter");
const VocabExercise = require("../models/vocab-exercise");
const ComprehensionExercise = require("../models/comprehension-exercise");
const Word = require("../models/word");
const Question = require("../models/question");
const Answer = require("../models/answer");
const bcrypt = require("bcryptjs");
const StudyMaterial = require("../models/study-material");

const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET_NAME;
aws.config = {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

const fs = require("fs");

exports.addNewMaterial = async (req, res, next) => {
    const chapterSel = await Chapter.findOne({ where: { id: req.body.chapterSelected } });

    const s3 = new aws.S3();
    const material = req.file;
    const fileContent = fs.readFileSync(material.filename);
    let date = Date.now();
    const keyName = "materials_" + chapterSel.id + "_" + date + "_" + material.filename;

    const params = {
        Bucket: S3_BUCKET,
        Key: keyName,
        Body: fileContent
    };

    s3.upload(params, function(err, data) {
        if(err) { throw err; };

        StudyMaterial.create({
            title: req.body.title,
            description: req.body.description,
            fileName: data.Key 
        })
            .then(async material => {
                await material.setChapter(chapterSel);
                return res.redirect("/enterprise/materials/add?success=true");
            })
            .catch(error => {
                console.log(error);
                return res.redirect("/enterprise/materials/add?success=false");
            })
    });
};

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

exports.removeWords = async (req, res, next) => {
    const word = await Word.findOne({ where: { id: req.query.id } });
    word.destroy();

    res.status(201).json({
        done: true
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

exports.getAddMaterialsPage = async (req, res, next) => {
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const course = await Course.findOne({ where: { id: user.CourseId } });

    const allChapters = await Chapter.findAll({ where: { CourseId: course.id } })
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/add-materials", {
        pageTitle: "Add a New Study Materials",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        course: course,
        chapters: allChapters,
        accountData: accountData
    }); 
};

exports.getChapterMaterials = (req, res) => {
    StudyMaterial.findAll({ where: { ChapterId: req.query.id } })
        .then(materials => {
            res.status(201).json({
                materials: materials
            });
        })
        .catch(error => { console.log(error); })
}

exports.getAddReadingExercisePage = async (req, res, next) => {
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const course = await Course.findOne({ where: { id: user.CourseId } });

    const allChapters = await Chapter.findAll({ where: { CourseId: course.id } })
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/add-comprehension-ex", {
        pageTitle: "Add a New Comprehension Exercise",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        course: course,
        chapters: allChapters,
        accountData: accountData
    }); 
};

exports.manageReadingExercises = async (req, res, next) => {
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const course = await Course.findOne({ where: { id: user.CourseId } });

    const allChapters = await Chapter.findAll({ where: { CourseId: course.id } });
    const allComprehEx = await ComprehensionExercise.findAll({ where: { EnterpriseUserId: user.id } })
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/manage-vocab-ex", {
        pageTitle: "Manage Vocabulary Exercises",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        course: course,
        chapters: allChapters,
        exercises: allComprehEx,
        accountData: accountData
    }); 
};

exports.uploadRecording = async (req, res) => {
    const s3 = new aws.S3();
    const material = req.files[0];
    const fileContent = fs.readFileSync(material.filename);

    const params = {
        Bucket: S3_BUCKET,
        Key: req.files[0].filename,
        Body: fileContent
    };

    s3.upload(params, function(err, data) {
        if(err) { throw err; };

        res.status(201).json({
            fileName: req.files[0].filename
        });
    });
}

exports.addNewComprehension = async (req, res) => {
    ComprehensionExercise.create({
        name: req.query.form.title,
        description: req.query.form.description,
        isCompleted: 0,
        textEng: req.query.form.textEng,
        textFor: req.query.form.textFor,
        file: req.query.form.file
    })
        .then(async exercise => {
            let chapter = await Chapter.findOne({ where: { id: req.query.form.chapterId } });
            const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });

            exercise.setChapter(chapter);
            exercise.setEnterpriseUser(user);

            let questions = req.query.questions;

            for(let i=0; i<questions.length; i++) {
                let newQuestion = await Question.create({
                    questionEnglish: questions[i].questionEng,
                    questionForeign: questions[i].questionFor,
                    isCompleted: 0
                });
                newQuestion.setComprehensionExercise(exercise);

                let answers = JSON.parse(questions[i].answers);
                for(let a=0; a<answers.length; a++) {
                    let newAnswer = await Answer.create({
                        answerEnglish: answers[a].text,
                        isCorrect: answers[a].correct==true ? 1 : 0
                    });
                    newAnswer.setQuestion(newQuestion);
                }
            }

            res.status(201).send("Created");
        })
        .catch(error => {
            console.log(error);
            res.status(400).send("Bad Request");
        })
}