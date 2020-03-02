const express = require("express");

const public = require("../controllers/public");
const authorise = require("../controllers/authentication");
const enterprise = require("../controllers/enterprise");

const studentRoutes = require("../routes/student");
const enterpriseRoutes = require("../routes/enterprise");

const notLoggedIn = require("../middleware/not-logged-in");
const isLoggedIn = require("../middleware/logged-in");

const router = express.Router();

// /enterprise
router.use("/enterprise", notLoggedIn, enterpriseRoutes);

// /student
router.use("/student", notLoggedIn, studentRoutes);

// /login => GET
router.get("/login", isLoggedIn, public.getLoginPage);

// /login/company => GET
router.get("/login/company", isLoggedIn, public.getLoginCompanyPage);

// /login/company => POST
router.post("/login/company", isLoggedIn, authorise.authenticateEnterpriseLogin);

// /login/student => GET
router.get("/login/student", isLoggedIn, public.getLoginStudentPage);

// /login/company => POST
// router.post("/login/student", authorise.authenticateStudentLogin);

// /register => GET
router.get("/register", isLoggedIn, public.getRegistrationPage);

// /register => POST
router.post("/register", isLoggedIn, enterprise.registerCompanyUser);

// /logout => ALL
router.use("/logout", authorise.userLogout);

// /contact/request => GET
router.get("/contact/request", public.getContactRequestPage);

// /contact/request => POST
router.post("/contact/request", public.sendContactRequest);

// / => ALL
router.use(public.getHomePage);

module.exports = router;