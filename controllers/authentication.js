const bcrypt = require("bcryptjs");
const EnterpriseUser = require("../models/enterprise-user");
const StudentUser = require("../models/student-user");
const Company = require("../models/company");
const Course = require("../models/course");
const Chapter = require("../models/chapter");

exports.authenticateEnterpriseLogin = (req, res, next) => {
    const emailToLogin = req.body.loginEmail;
    const passwordToLogin = req.body.loginPass;
    EnterpriseUser.findOne({ where: { email: emailToLogin }, include: [Company] })
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
                        req.session.userId = user.id;
                        req.session.isLoggedIn = true;
                        req.session.isEnterprise = true;
                        req.session.isAdmin = user.isAdmin==1 ? true : false;
                        req.session.isStudent = false;
                        req.session.companyId = user.Company.id;
                        req.session.isLeader = user.CourseId==null ? false : true;
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

exports.authenticateStudentLogin = (req, res, next) => {
    const emailToLogin = req.body.loginEmail;
    const passwordToLogin = req.body.loginPass;
    StudentUser.findOne({ where: { email: emailToLogin }, include: [ Course, Company ] })
        .then(user => {
            if(user == null) {
                return res.redirect("/register");
            }
            if(user.disabled == 1) {
                return res.redirect("/login?disabled=true");
            }
            if(user.CourseId == null) {
                return res.redirect("/login?active=false");
            }
            bcrypt
                .compare(passwordToLogin, user.password)
                .then(async passwordMatching => {
                    if(passwordMatching) {
                        let chapters = await Chapter.findAll({ where: { CourseId: user.CourseId } });
                        req.session.userId = user.id;
                        req.session.isLoggedIn = true;
                        req.session.isStudent = true;
                        req.session.company = user.Company;
                        req.session.course = user.Course;
                        req.session.chapters = chapters;
                        return req.session.save(error => {
                            res.redirect("/student/panel");
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
    req.session.destroy(err => {
        res.redirect("/");
    });
};