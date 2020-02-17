exports.getLoginPage = (req, res, next) => {
    res.render("login-page");
};

exports.getLoginCompanyPage = (req, res, next) => {
    res.render("login-company");
};

exports.getRegistrationPage = (req, res, next) => {
    res.render("registration-page");
};

exports.getHomePage = (req, res, next) => {
    res.render("home-page", {
        pageTitle: "Home"
    });
};