const express = require("express");

const enterprise = require("../controllers/enterprise");
const leader = require("../controllers/leader");
const isAdmin = require("../middleware/adminAccess");

const router = express.Router();

// /add => GET
router.get("/add", isAdmin, enterprise.getAddCoursePage);

// /add => POST
router.post("/add", isAdmin, enterprise.addNewCourse);

// /assign => GET
router.get("/assign", isAdmin, enterprise.getAssignCoursePage);

// /assign => POST
router.post("/assign", isAdmin, enterprise.assignCourse);

// /edit/:id => GET
router.get("/edit/:id", isAdmin, enterprise.getEditCoursePage);

// /edit/:id => POST
router.post("/edit/:id", isAdmin, enterprise.updateCourse);

// /change-assign => GET
router.get("/change-assign", isAdmin, enterprise.getChangeAssignCoursePage);

// /change-assign => POST
router.post("/change-assign", isAdmin, enterprise.changeAssignCourse);

// /view => GET
router.get("/view", isAdmin, enterprise.getViewCoursesPage);

// /chapters/add => GET
router.get("/chapters/add", leader.getAddChapterPage);

// /chapters/add => POST
router.post("/chapters/add", leader.addChapter);

module.exports = router;