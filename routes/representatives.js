const express = require("express");

const enterprise = require("../controllers/enterprise");

const router = express.Router();

// /add => GET
router.get("/add", enterprise.getAddRepresentativePage);

// /add => POST
router.post("/add", enterprise.addNewRepresentative);

// /view => GET
router.get("/view", enterprise.getViewRepresentativesPage);

module.exports = router;