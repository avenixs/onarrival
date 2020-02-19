const express = require("express");

const enterprise = require("../controllers/enterprise");

const adminRoutes = require("../routes/admin");

const router = express.Router();

router.use("/admin", adminRoutes);

// /panel => GET
router.get("/panel", enterprise.getPanelPage);

module.exports = router;