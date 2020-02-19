exports.getLoginPage = (req, res, next) => {
    res.render("general-login", {
        pageTitle: "Login"
    });
};