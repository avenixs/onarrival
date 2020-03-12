const express = require("express");
const student = require("../controllers/student");
const router = express.Router();

const VocabExercise = require("../models/vocab-exercise");
const Word = require("../models/word");

router.param('chapterId', function(req, res, next, chapterId) {
    VocabExercise.findAll( { where: { ChapterId: chapterId } } )
        .then(exercises => {
            req.vocabEx = exercises;
            next();
        })
        .catch(error => {
            console.log(error);
        })
});

router.param('learnVocabExId', function(req, res, next, learnVocabExId) {
    Word.findAll( { where: { VocabExerciseId: learnVocabExId } } )
        .then(words => {
            req.words = words;
            next();
        })
        .catch(error => {
            console.log(error);
        })
});

// /:chapterId/vocab => GET
router.get("/:chapterId/vocab", student.getChapterVocabEx);

// /:chapterId/vocab/learn => GET
router.get("/:chapterId/vocab/learn", student.getChapterLearningVocabEx);

// /:chapterId/vocab/quiz => GET
router.get("/:chapterId/vocab/quiz", student.getChapterQuizVocabEx);

// /:chapterId/vocab/learn/:learnVocabExId => GET
router.get("/:chapterId/vocab/learn/:learnVocabExId", student.learningVocabEx);

module.exports = router;