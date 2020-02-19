const express = require("express");

const public = require("../controllers/public");
const authorise = require("../controllers/authentication");

const router = express.Router();

// /login => GET
router.get("/login", public.getLoginPage);

// /login/company => GET
router.get("/login/company", public.getLoginCompanyPage);

// /login/company => POST
router.post("/login/company", authorise.authenticateEnterpriseLogin);

// /login/student => GET
router.get("/login/student", public.getLoginStudentPage);

// /login/company => POST
// router.post("/login/student", authorise.authenticateStudentLogin);

// /register => GET
router.get("/register", public.getRegistrationPage);

// /register => POST
//router.post("/register", authorise.registerUser);

// / => ALL
router.use(public.getHomePage);

module.exports = router;