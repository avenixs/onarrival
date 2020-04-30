const express = require("express");

const enterprise = require("../controllers/enterprise");

const router = express.Router();

// /add => GET
router.get("/add", enterprise.getAddStudentPage);

// /add => POST
router.post("/add", enterprise.addNewStudent);

// /edit/:id => GET
router.get("/edit/:id", enterprise.getEditStudentPage);

// /edit/:id => POST
router.post("/edit/:id", enterprise.updateStudent);

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

// /confirm-unique-email => POST
router.post("/confirm-unique-email", enterprise.confirmStudentUnique);

module.exports = router;