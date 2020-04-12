const ContactRequest = require("../models/contact-request");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLoginPage = (req, res, next) => {
    res.render("general-login", {
        pageTitle: "Login",
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.getLoginCompanyPage = (req, res, next) => {
    res.render("company-login", {
        pageTitle: "Company Login",
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.getLoginStudentPage = (req, res, next) => {
    res.render("student-login", {
        pageTitle: "Student Login",
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.getRegistrationPage = (req, res, next) => {
    res.render("registration-page", {
        pageTitle: "Registration",
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.getHomePage = (req, res, next) => {
    res.render("home-page", {
        pageTitle: "Home",
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.getContactRequestPage = (req, res, next) => {
    res.render("contact-request", {
        pageTitle: "Request a contact with your employer",
        success: req.query.success,
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.sendContactRequest = (req, res, next) => {
    ContactRequest.create({
        companyName: req.body.companyName,
        companyEmail: req.body.companyEmail,
        companyTel: req.body.companyTel,
        mgrName: req.body.mgrName,
        mgrDepartment: req.body.mgrDep,
        description: req.body.positionDescription
    })
        .then(request => {
            res.redirect("/contact/request?success=true");

            let messageAboutMgr = "There are no details on the manager or the department.";
            if(!(request.mgrName == null)) {
                messageAboutMgr = "The name of the employee's manager is " + request.mgrName + ".";
            }

            const msg = {
                to: "wojtund@my.westminster.ac.uk",
                from: "contact@onarrival.uk",
                subject: "New contact request from an employee!",
                text: "Dear Team, This is to inform you that a new contact request has been filed by an employee of " + request.companyName + ". You can contact them using their email address " + request.companyEmail + " or call them on " + request.companyTel + ". " + messageAboutMgr + " This is what they have mentioned: " + request.description + " Thank you very much, OnArrivalUK",
                html: "Dear Team, <br/ ><br />This is to inform you that a new contact request has been filed by an employee of <b>" + request.companyName + "</b>. You can contact them using their email address <b>" + request.companyEmail + "</b> or call them on " + request.companyTel + ". " + messageAboutMgr + "<br /><br />This is what they have mentioned: <i>" + request.description + "</i><br /><br />Thank you very much, <br />OnArrivalUK"
            }

            return sgMail.send(msg);
        })
        .catch(error => { console.log(error); })
};

exports.disabledCourse = (req, res, next) => {
    res.render("disabled-course", {
        pageTitle: "Your Course Is Disabled",
        isLoggedIn: req.session.isLoggedIn
    });
};