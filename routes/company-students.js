const express = require("express");

const enterprise = require("../controllers/enterprise");

const router = express.Router();

// /add => GET
router.get("/add", enterprise.getAddStudentPage);

// /add => POST
router.post("/add", enterprise.addNewStudent);

// /enrol => GET
router.get("/enrol", enterprise.getEnrolStudentPage);

// /enrol => POST
router.post("/enrol", enterprise.enrolStudent);

// /view => GET
router.get("/view", enterprise.getViewStudentsPage);

// /results => GET
router.get("/results", enterprise.getStudentResultsPage);

// /get-student-results => POST
router.post("/get-student-results", enterprise.getStudentResults);

module.exports = router;