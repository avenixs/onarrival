const express = require("express");

const enterprise = require("../controllers/enterprise");

const router = express.Router();

// /add => GET
router.get("/add", enterprise.getAddRepresentativePage);

// /add => POST
router.post("/add", enterprise.addNewRepresentative);

// /edit/:id => GET
router.get("/edit/:id", enterprise.getEditLeaderPage);

// /edit/:id => POST
router.post("/edit/:id", enterprise.updateLeader);

// /view => GET
router.get("/view", enterprise.getViewRepresentativesPage);

// /confirm-unique-email => POST
router.post("/confirm-unique-email", enterprise.confirmLeaderUnique);

module.exports = router;