const express = require("express");

const student = require("../controllers/student");

const chaptersRoutes = require("../routes/chapters");

const router = express.Router();

// /download-list-words => POST
router.post("/download-list-words", student.downloadListWords);

// /chapters => GET
router.use("/chapters", chaptersRoutes);

// /panel => GET
router.get("/panel", student.getPanelPage);

// /get-full-name => GET
router.get("/get-full-name", student.getFullName);

// /panel => GET
router.get("/", student.getPanelPage);

module.exports = router;