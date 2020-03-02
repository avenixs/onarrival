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

module.exports = router;