const EnterpriseUser = require("../models/enterprise-user");
const Company = require("../models/company");
const Course = require("../models/course");
const StudentUser = require("../models/student-user");
const bcrypt = require("bcryptjs");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("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");

exports.getPanelPage = async (req, res, next) => {
    const company = await Company.findOne({ where: { id: req.session.companyId } });
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const courses = await Course.findAll({ where: { CompanyId: company.id } });

    let oneCourse = [];

    for(let i=0; i<courses.length; i++) {
        if(courses[i].id == user.CourseId) {
            oneCourse.push(courses[i]);
        }
    }

    req.session.fullName = user.name + " " + user.surname;
    req.session.companyName = company.name;
    req.session.courseTitle = oneCourse[0].title;

    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];
    
    res.render("panel/company-main", {
        pageTitle: "Main Panel",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        company: company,
        user: user,
        course: oneCourse,
        accountData: accountData
    });
};

exports.registerCompanyUser = (req, res, next) => {
    EnterpriseUser.findOne({ where: { email: req.body.adminEmail } })
        .then(async function(user) {
            if(user != null) {
                return res.redirect("/register?unique-email=false");
            }

            const newCompany = await Company.create({
                name: req.body.companyName,
                email: req.body.companyEmail,
                telNum: req.body.companyTel
            });

            const passwordHashed = await bcrypt.hash(req.body.adminPassword, 12);

            EnterpriseUser.create({
                email: req.body.adminEmail,
                password: passwordHashed,
                name: req.body.adminName,
                surname: req.body.adminSurname,
                department: req.body.adminDep,
                isAdmin: 1
            })
                .then(entUser => {
                    entUser.setCompany(newCompany);

                    return res.redirect("/register?success=true");
                })
                .catch(error => {
                    console.log(error);
                    return res.redirect("/register?success=false");
                })
        })
        .catch(error => { console.log(error); })
}

exports.getAddRepresentativePage = (req, res, next) => {
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/add-leader", {
        pageTitle: "Add a New Course Leader",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        accountData: accountData
    });
};

exports.getAddCoursePage = (req, res, next) => {
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/add-course", {
        pageTitle: "Add a New Course",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        accountData: accountData
    });
};

exports.addNewRepresentative = async (req, res, next) => {
    const passwordHashed = await bcrypt.hash(req.body.pass, 12);
    const company = await Company.findOne({ where: { id: req.session.companyId } });

    EnterpriseUser.create({
        email: req.body.email,
        password: passwordHashed,
        name: req.body.name,
        surname: req.body.surname,
        department: req.body.dep,
        isAdmin: req.body.adminRights
    })
        .then(entUser => {
            entUser.setCompany(company);

            res.redirect("/enterprise/leaders/add?success=true");

            const msg = {
                to: entUser.email,
                from: "contact@onarrival.uk",
                subject: "OnArrivalUK - Your account is ready",
                text: "Dear " + entUser.name + ", This is to inform you that your employer has set up an OnArrivalUK account for you. You may soon become a Course Leader and contribute to investing in your staff members. Use the following credentials to log in and stay tuned for news from your employer. Email: " + entUser.email + " Password: " + req.body.pass + " Have a lovely day, OnArrivalUK",
                html: "Dear " + entUser.name + ", <br /><br />This is to inform you that your employer has set up an OnArrivalUK account for you. You may soon become a Course Leader and contribute to investing in your staff members. Use the following credentials to log in and stay tuned for news from your employer. <br /><br /><b>Email</b>: " + entUser.email + " <br /><b>Password</b>: " + req.body.pass + " <br /><br />Have a lovely day, <br />OnArrivalUK<br /><img src='https://i.imgur.com/gI3MKyK.jpg' alt='LonAUK Logo'>"
            }

            return sgMail.send(msg);
        })
        .catch(error => {
            console.log(error);
            return res.redirect("/enterprise/leaders/add?success=false");
        })
};

exports.getAssignCoursePage = async (req, res, next) => {
    const employees = await EnterpriseUser.findAll({ where: { CompanyId: req.session.companyId, CourseId: null } });
    const courses = await Course.findAll({ where: { CompanyId: req.session.companyId, hasLeader: 0 } });
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/assign-course", {
        pageTitle: "Add a New Course",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        leaders: employees,
        courses: courses,
        accountData: accountData
    });
};

exports.getEnrolStudentPage = async (req, res, next) => {
    const students = await StudentUser.findAll({ where: { CompanyId: req.session.companyId, CourseId: null } });
    const courses = await Course.findAll({ where: { CompanyId: req.session.companyId } });
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/enrol-student", {
        pageTitle: "Enrol a Student to a Course",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        students: students,
        courses: courses,
        accountData: accountData
    });
};

exports.enrolStudent = async (req, res, next) => {
    const course = await Course.findOne({ where: { id: req.body.coursesToAssign } });
    const student = await StudentUser.findOne({ where: { id: req.body.studentsToAssign } });

    student.setCourse(course);
    student.save();

    res.redirect("/enterprise/students/enrol?success=true");

    const msg = {
        to: student.email,
        from: "contact@onarrival.uk",
        subject: "OnArrivalUK - Your account is ready",
        text: "Dear " + student.name + ", This is to inform you that you have just been enroled to the " + course.title + " language course designed by your employer. Log in to you OnArrivalUK account to gain access to it and begin improving your English skills. Have a lovely day, OnArrivalUK",
        html: "Dear " + entUser.name + ", <br /><br />This is to inform you that you have just been enroled to the " + course.title + " language course designed by your employer. Log in to you OnArrivalUK account to gain access to it and begin improving your English skills.<br /><br />Have a lovely day, <br />OnArrivalUK<br /><img src='https://i.imgur.com/gI3MKyK.jpg' alt='LonAUK Logo'>"
    }

    return sgMail.send(msg);
};

exports.addNewCourse = async (req, res, next) => {
    const company = await Company.findOne({ where: { id: req.session.companyId } });

    Course.create({
        title: req.body.title,
        description: req.body.description,
        mainLanguage: req.body.language,
        difficulty: req.body.diff,
    })
        .then(course => {
            course.setCompany(company);

            return res.redirect("/enterprise/courses/add?success=true");
        })
        .catch(error => {
            console.log(error);
            return res.redirect("/enterprise/courses/add?success=false");
        })
};

exports.assignCourse = async (req, res, next) => {
    const course = await Course.findOne({ where: { id: req.body.coursesToAssign } });
    const leader = await EnterpriseUser.findOne({ where: { id: req.body.leadersToAssign } });

    leader.setCourse(course);
    await leader.save();

    course.hasLeader = 1;
    await course.save();

    if(leader.id == req.session.userId) {
        req.session.isLeader = 1;
    };

    res.redirect("/enterprise/courses/assign?success=true");

    const msg = {
        to: entUser.email,
        from: "contact@onarrival.uk",
        subject: "OnArrivalUK - You are now a Course Leader!",
        text: "Dear " + leader.name + ", This is to inform you that you have been appointed a Course Leader of " + course.title + ". Login to your OnArrivalUK account to begin creating exciting content for your employees. Have a lovely day, OnArrivalUK",
        html: "Dear " + leader.name + ", <br /><br />This is to inform you that you have been appointed a Course Leader of " + course.title + ". Login to your OnArrivalUK account to begin creating exciting content for your employees. <br /><br />Have a lovely day, <br />OnArrivalUK<br /><img src='https://i.imgur.com/gI3MKyK.jpg' alt='LonAUK Logo'>"
    }

    return sgMail.send(msg);
};

exports.getAddStudentPage = async (req, res, next) => {
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/add-student", {
        pageTitle: "Add a New Student",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        accountData: accountData
    });
};

exports.addNewStudent = async (req, res, next) => {
    const company = await Company.findOne({ where: { id: req.session.companyId } });
    const hashed = await bcrypt.hash(req.body.pass, 12);

    StudentUser.create({
        email: req.body.email,
        password: hashed,
        name: req.body.name,
        surname: req.body.surname,
        nationality: req.body.nationality,
        dateOfBirth: req.body.dateOfBirth,
    })
        .then(student => {
            student.setCompany(company);

            res.redirect("/enterprise/students/add?success=true");

            const msg = {
                to: student.email,
                from: "contact@onarrival.uk",
                subject: "OnArrivalUK - Your account is ready",
                text: "Dear " + student.name + ", This is to inform you that your employer has set up an OnArrivalUK account for you. You may soon join an exciting language course which will prepare you for your new position at the company. Use the following credentials to log in and stay tuned for news from your employer. Email: " + student.email + " Password: " + req.body.pass + " Have a lovely day, OnArrivalUK",
                html: "Dear " + entUser.name + ", <br /><br />This is to inform you that your employer has set up an OnArrivalUK account for you. You may soon join an exciting language course which will prepare you for your new position at the company. Use the following credentials to log in and stay tuned for news from your employer. <br /><br /><b>Email</b>: " + student.email + " <br /><b>Password</b>: " + req.body.pass + " <br /><br />Have a lovely day, <br />OnArrivalUK<br /><img src='https://i.imgur.com/gI3MKyK.jpg' alt='LonAUK Logo'>"
            }

            return sgMail.send(msg);
        })
        .catch(error => {
            console.log(error);
            return res.redirect("/enterprise/students/add?success=false");
        })
};


exports.getViewRepresentativesPage = (req, res, next) => {
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];
    res.render("panel/view-leaders", {
        pageTitle: "View Your Course Leaders",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        accountData: accountData
    });
};