const express = require("express");

const enterprise = require("../controllers/enterprise");
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

module.exports = router;