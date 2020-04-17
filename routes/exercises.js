const express = require("express");

const leader = require("../controllers/leader");

const router = express.Router();

let multer  = require('multer');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './');
    },
    filename: (req, file, cb) => {
        let name = Date.now() + "_" + req.session.userId + "_Recording.mp3";
        cb(null, name);
    }
});
let upload = multer({ storage: storage });

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

// /comprehension/add => GET
router.get("/comprehension/add", leader.getAddReadingExercisePage);

// /comprehension/manage => GET
router.get("/comprehension/manage", leader.manageComprehensionExercises);

// /comprehension/add-comprehension => GET
router.get("/comprehension/add-comprehension", leader.addNewComprehension);

// /comprehension/upload-recording => POST
router.post("/comprehension/upload-recording", upload.any(), leader.uploadRecording);

// /comprehension/view/:id => GET
router.get("/comprehension/view/:id", leader.viewComprehensionExercise);

// /comprehension/edit/:id => GET
router.get("/comprehension/edit/:id", leader.editComprehensionExercise);

// /comprehension/edit/:id => POST
router.post("/comprehension/edit/:id", leader.saveEditComprehExercise);

// /comprehension/edit-questions/:id => GET
router.get("/comprehension/edit-questions/:id", leader.editComExQuestionsPage);

// /comprehension/save-edited-questions => POST
router.get("/comprehension/save-edited-questions", leader.saveEditedComQuestions);

module.exports = router;