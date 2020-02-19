const bcrypt = require("bcryptjs");
const EnterpriseUser = require("../models/enterprise-user");
const StudentUser = require("../models/student-user");

exports.authenticateEnterpriseLogin = (req, res, next) => {
    const emailToLogin = req.body.loginEmail;
    const passwordToLogin = req.body.loginPass;
    EnterpriseUser.findOne({ where: { email: emailToLogin } })
        .then(user => {
            if(user == null) {
                return res.redirect("/register");
            }
            if(user.disabled == 1) {
                return res.redirect("/login?disabled=true");
            }
            bcrypt
                .compare(passwordToLogin, user.password)
                .then(passwordMatching => {
                    if(passwordMatching) {
                        req.session.isLoggedIn = true;
                        req.session.isEnterprise = true;
                        req.session.isStudent = false;
                        return req.session.save(error => {
                            res.redirect("/enterprise/panel");
                        });
                    } else {
                        return res.redirect("/login");
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
        .catch(error => {
            console.log(error);
        })
};

exports.userLogout = (req, res, next) => {
    console.log("YESSSS");
    req.session.destroy(err => {
        res.redirect("/");
    });
};