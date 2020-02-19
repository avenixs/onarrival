exports.getLoginPage = (req, res, next) => {
    res.render("general-login", {
        pageTitle: "Login"
    });
};

exports.getLoginCompanyPage = (req, res, next) => {
    res.render("company-login", {
        pageTitle: "Company Login"
    });
};

exports.getLoginStudentPage = (req, res, next) => {
    res.render("student-login", {
        pageTitle: "Student Login"
    });
};

exports.getRegistrationPage = (req, res, next) => {
    res.render("registration-page", {
        pageTitle: "Registration"
    });
};

exports.getHomePage = (req, res, next) => {
    res.render("home-page", {
        pageTitle: "Home"
    });
};