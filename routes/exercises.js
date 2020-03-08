const express = require("express");

const leader = require("../controllers/leader");

const router = express.Router();

// /vocab/add => GET
router.get("/vocab/add", leader.getAddVocabExercisePage);

// /get-vocab-chapter => GET
router.get("/get-vocab-chapter", leader.getVocabExPerChapter);

// /vocab/add => POST
router.post("/vocab/add", leader.addNewVocabExercise);

// /vocab/view => GET
router.get("/vocab/manage", leader.getManageVocabExPage);

// /vocab/get-words => GET
router.get("/vocab/get-words", leader.getWordsFromExercise);

// /vocab/add-word => GET
router.get("/vocab/add-word", leader.addNewWord);

module.exports = router;