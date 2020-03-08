const express = require("express");

const enterprise = require("../controllers/enterprise");

const adminRoutes = require("./admin");
const repRoutes = require("./leaders");
const coursesRoutes = require("./courses");
const studentsRoutes = require("./company-students");
const exercisesRoutes = require("./exercises");

const isAdmin = require("../middleware/adminAccess");

const router = express.Router();

router.use("/admin", adminRoutes);

// /representatives => ALL
router.use("/leaders", isAdmin, repRoutes);

// /courses => ALL
router.use("/courses", coursesRoutes);

// /exercises => ALL
router.use("/exercises", exercisesRoutes);

// /courses => ALL
router.use("/students", isAdmin, studentsRoutes);

// /panel => GET
router.get("/panel", enterprise.getPanelPage);

// /panel => GET
router.get("/", enterprise.getPanelPage);

module.exports = router;