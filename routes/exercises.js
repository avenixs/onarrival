const express = require("express");

const leader = require("../controllers/leader");

const router = express.Router();

// /vocab/add => GET
router.get("/vocab/add", leader.getAddVocabExercisePage);

// /get-vocab-chapter => GET
router.get("/get-vocab-chapter", leader.getVocabExPerChapter);

// /get-chapter-materials => GET
router.get("/get-chapter-materials", leader.getChapterMaterials);

// /vocab/add => POST
router.post("/vocab/add", leader.addNewVocabExercise);

// /vocab/view => GET
router.get("/vocab/manage", leader.getManageVocabExPage);

// /vocab/get-words => GET
router.get("/vocab/get-words", leader.getWordsFromExercise);

// /vocab/add-word => GET
router.get("/vocab/add-word", leader.addNewWord);

// /vocab/update-word => GET
router.get("/vocab/update-word", leader.updateWord);

// /vocab/update-word => GET
router.get("/vocab/remove-word", leader.removeWords);

module.exports = router;