exports.isAdmin = (req, res, next) => {
    if(!req.session.isAdmin) return res.redirect("/enterprise/panel");
    next();
}

exports.isLoggedIn = (req, res, next) => {
    if(!req.session.isLoggedIn) return res.redirect("/login");
    next();
}

exports.redirectLoggedIn = (req, res, next) => {
    if(req.session.isLoggedIn) {
        if(req.session.isEnterprise) return res.redirect("/enterprise/panel");
        if(req.session.isStudent) return res.redirect("/student/panel");

        return res.redirect("/error");
    }

    next();
}