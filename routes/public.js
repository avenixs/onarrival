const express = require("express");
const router = express.Router();

const studentRoutes = require("../routes/student");
const enterpriseRoutes = require("../routes/enterprise");

const { 
    getHomePage,
    getLoginPage, 
    getLoginCompanyPage, 
    getLoginStudentPage, 
    getRegistrationPage, 
    getContactRequestPage, 
    sendContactRequest, 
    disabledCourse 
} = require("../controllers/public");

const {
    verifyEmail,
    authenticateEnterpriseLogin,
    authenticateStudentLogin,
    userLogout
} = require("../controllers/authentication");

const { confirmLeaderUnique, registerCompanyUser } = require("../controllers/enterprise");

const { isLoggedIn, redirectLoggedIn } = require("../middleware/authorisation");

router.get("/verify/:verificationCode", verifyEmail);

router.get("/verify", (req, res) => res.redirect("/login/company"));

router.use("/enterprise", isLoggedIn, enterpriseRoutes);

router.use("/student", isLoggedIn, studentRoutes);

router.get("/login", redirectLoggedIn, getLoginPage);

router.get("/login/company", redirectLoggedIn, getLoginCompanyPage);

router.post("/login/company", redirectLoggedIn, authenticateEnterpriseLogin);

router.get("/login/student", redirectLoggedIn, getLoginStudentPage);

router.post("/login/student", authenticateStudentLogin);

router.post("/register/confirm-unique-email", confirmLeaderUnique);

router.get("/register", redirectLoggedIn, getRegistrationPage);

router.post("/register", redirectLoggedIn, registerCompanyUser);

router.use("/logout", userLogout);

router.get("/contact/request", getContactRequestPage);

router.post("/contact/request", sendContactRequest);

router.get("/disabled-course", disabledCourse);

router.use(getHomePage);

module.exports = router;