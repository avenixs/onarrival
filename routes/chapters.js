const express = require("express");
const student = require("../controllers/student");
const router = express.Router();

const VocabExercise = require("../models/vocab-exercise");
const StudyMaterial = require("../models/study-material");
const ComprehensionEx = require("../models/comprehension-exercise");
const Word = require("../models/word");

router.param('vocExChapterId', function(req, res, next, vocExChapterId) {
    VocabExercise.findAll( { where: { ChapterId: vocExChapterId } } )
        .then(exercises => {
            req.vocabEx = exercises;
            next();
        })
        .catch(error => {
            console.log(error);
        })
});

router.param('learnVocabExId', function(req, res, next, learnVocabExId) {
    req.exId = learnVocabExId;
    next();
});

router.param('studyChapterId', function(req, res, next, studyChapterId) {
    StudyMaterial.findAll({ where: { ChapterId: studyChapterId } })
        .then(materials => {
            req.studyMaterials = materials;
            next();
        })
        .catch(error => { console.log(error); })
});

router.param('comprehensionChapterId', function(req, res, next, comprehensionChapterId) {
    ComprehensionEx.findAll({ where: { ChapterId: comprehensionChapterId } })
        .then(exercises => {
            req.chapterID = comprehensionChapterId;
            req.exercises = exercises;
            next();
        })
        .catch(error => { console.log(error); })
});

// /:vocExChapterId/vocab => GET
router.get("/:vocExChapterId/vocab", student.getChapterVocabEx);

// /:vocExChapterId/vocab/learn => GET
router.get("/:vocExChapterId/vocab/learn", student.getChapterLearningVocabEx);

// /:vocExChapterId/vocab/quiz => GET
router.get("/:vocExChapterId/vocab/quiz", student.getChapterQuizVocabEx);

// /:vocExChapterId/vocab/learn/:learnVocabExId => GET
router.get("/:vocExChapterId/vocab/learn/:learnVocabExId", student.learningVocabEx);

// /find-exercise-words => GET
router.use("/find-exercise-words", student.findExerciseWords);

// /find-exercise-words => GET
router.use("/set-word-remembered", student.setWordRemembered);

// /download-material => GET
router.use("/download-material", student.downloadMaterial);

// /:studyChapterId/materials => GET
router.get("/:studyChapterId/materials", student.getMaterialsPage);

// /:comprehensionChapterId/comprehension => GET
router.get("/:comChapId/comprehension/:compExId", student.viewComprehension);

// /:comprehensionChapterId/comprehension => GET
router.get("/:comprehensionChapterId/comprehension", student.getComprehensionPage);

// /:resultChapterId/results => GET
router.get("/:resultChapterId/results", student.getResultsInChapter);

// /get-audio => GET
router.get("/get-audio", student.getAudio);

// /get-text-translation => GET
router.get("/get-text-translation", student.getTranslation);

// /get-test-questions => GET
router.get("/get-test-questions", student.getTestQuestions);

// /save-test-result => GET
router.get("/save-test-result", student.saveTestResult);

module.exports = router;