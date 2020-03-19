const express = require("express");
const student = require("../controllers/student");
const router = express.Router();

const VocabExercise = require("../models/vocab-exercise");
const StudyMaterial = require("../models/study-material");
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
    console.log(studyChapterId);
    StudyMaterial.findAll({ where: { ChapterId: studyChapterId } })
        .then(materials => {
            console.log(materials);
            req.studyMaterials = materials;
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

module.exports = router;