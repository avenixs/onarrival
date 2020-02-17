module.exports = (req, res, next) => {
    if(req.session.isLoggedIn) {
        if(req.session.isEnterprise) {
            return res.redirect('/enterprise/panel');
        } else if(req.session.isStudent) {
            return res.redirect('/student/panel');
        } else {
            return res.redirect('/error');
        }
    }
    next();
};