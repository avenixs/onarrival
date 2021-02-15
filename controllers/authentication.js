const bcrypt = require("bcryptjs");
const EnterpriseUser = require("../models/enterprise-user");
const StudentUser = require("../models/student-user");
const Company = require("../models/company");
const Course = require("../models/course");
const Chapter = require("../models/chapter");
const Verification = require("../models/verification");

exports.authenticateEnterpriseLogin = async (req, res) => {
    let user, leadingCourse;

    try {
        user = await EnterpriseUser.findOne({ 
            where: { email: req.body.loginEmail }, 
            include: { model: Company }
        })
    } catch(error) {
        console.log(error);
        return res.redirect("/register");
    }

    if(!user) return res.redirect("/register");

    if(!!user.disabled) return res.redirect("/login?disabled=true");

    const passMatch = await bcrypt.compare(req.body.loginPass, user.password);

    if(!passMatch) return res.redirect("/login");

    req.session.userId = user.id;
    req.session.isLoggedIn = true;
    req.session.isEnterprise = true;
    req.session.isAdmin = !!user.isAdmin;
    req.session.isStudent = false;
    req.session.companyId = user.Company.id;
    req.session.isLeader = !!user.CourseId;

    if(!!user.CourseId) {
        try {
            leadingCourse = await Course.findOne({ where: { id: user.CourseId } });
        } catch(error) {
            console.log(error);
            return res.redirect("/login?error=true");
        }
        
        if(!leadingCourse) return res.redirect("/login?error=true");

        req.session.leadingCourse = leadingCourse;
    }

    return req.session.save(error => {
        res.redirect("/enterprise/panel");
    })
}

exports.authenticateStudentLogin = async (req, res) => {
    let user;

    try {
        user = await StudentUser.findOne({ 
            where: { email: req.body.loginEmail }, 
            include: [
                {
                    model:  Course,
                    include: {
                        model: Chapter,
                        attributes: ["id", "number", "title"]
                    }
                },
                {
                    model:  Company,
                    attributes: ["id", "name"]
                }
            ] 
        })
    } catch(error) {
        console.log(error);
        return res.redirect("/login/student?error=true");
    }

    if(!user) return res.redirect("/login/student?error=true");

    if(!!user.disabled) return res.redirect("/login/student?disabled=true");

    if(!user.CourseId) return res.redirect("/login/student?active=false");

    const passMatch = await bcrypt.compare(req.body.loginPass, user.password);

    if(!passMatch) return res.redirect("/login/student?error=true");

    if(!!user.Course.disabled) return res.redirect("/disabled-course");

    req.session.userId = user.id;
    req.session.isLoggedIn = true;
    req.session.isStudent = true;
    req.session.company = user.Company;
    req.session.course = user.Course;
    req.session.chapters = user.Course.Chapters;

    return req.session.save(error => {
        if(error) console.log(error);

        res.redirect("/student/panel");
    })
}

exports.userLogout = (req, res, next) => {
    req.session.destroy(error => {
        if(error) console.log(error);

        res.redirect("/");
    })
}

exports.verifyEmail = async (req, res) => {
    let verification;

    try {
        verification = await Verification.findOne({ 
            where: { VerificationCode: req.params.verificationCode },
            include: {
                model: EnterpriseUser,
                attributes: ["id", "disabled"],
                required: true
            }
        })
    } catch(error) {
        console.log(error);
        return res.redirect("/register?error=true");
    }

    if(!verification) return res.redirect("/register?error=true");

    verification.EnterpriseUser.disabled = false;

    try {
        await verification.EnterpriseUser.save();
        await verification.destroy();
    } catch(error) {
        console.log(error);
        return res.redirect("/register?error=true");
    }

    return res.render("verification-page", {
        pageTitle: "Successful Email Verification",
        publicPath: "/",
        success: true
    })
}