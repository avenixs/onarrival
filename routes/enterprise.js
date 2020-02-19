const express = require("express");

const enterprise = require("../controllers/enterprise");

const adminRoutes = require("../routes/admin");
const repRoutes = require("../routes/representatives");

const router = express.Router();

router.use("/admin", adminRoutes);

// /representatives => ALL
router.use("/representatives", repRoutes);

// /panel => GET
router.get("/panel", enterprise.getPanelPage);

module.exports = router;