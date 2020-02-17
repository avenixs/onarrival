const bcrypt = require("bcryptjs");
const EnterpriseUser = require("../models/enterprise-user");
const StudentUser = require("../models/student-user");

exports.authenticateEnterpriseLogin = (req, res, next) => {
    const email = req.body.loginEmail;
    const password = req.body.loginPassword;
    EnterpriseUser.findOne({ where: { userEmail: email } })
        .then(user => {
            if(user == null) {
                return res.redirect("/register");
            }
            if(userRetrieved.disabled == 1) {
                return res.redirect("/login?disabled=true");
            }
            bcrypt
                .compare(password, user.password)
                .then(passwordMatching => {
                    if(passwordMatching) {
                        req.session.isLoggedIn = true;
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

exports.registerUser = (req, res, next) => {

};

exports.userLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect("/");
    });
};