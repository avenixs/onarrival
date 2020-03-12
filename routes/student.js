const express = require("express");

const student = require("../controllers/student");

const chaptersRoutes = require("../routes/chapters");

const router = express.Router();

// /chapters => GET
router.use("/chapters", chaptersRoutes);

// /panel => GET
router.get("/panel", student.getPanelPage);

// /panel => GET
router.get("/", student.getPanelPage);

module.exports = router;