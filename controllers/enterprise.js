const EnterpriseUser = require("../models/enterprise-user");
const Company = require("../models/company");
const Course = require("../models/course");
const Chapter = require("../models/chapter");
const StudentUser = require("../models/student-user");
const Score = require("../models/score");
const ComprehensionExercise = require("../models/comprehension-exercise");
const VocabularyExercise = require("../models/vocab-exercise");
const Verification = require("../models/verification");

const bcrypt = require("bcryptjs");
const cryptoRandomString = require('crypto-random-string');

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    req.session.courseTitle = "";

    req.session.fullName = user.name + " " + user.surname;
    req.session.companyName = company.name;
    try {
        req.session.courseTitle = oneCourse[0].title;
    } catch(error) {
        console.log(error);
    }
    

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
        .then(async user => {
            if(user != null) {
                return res.redirect("/register?success=false");
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
                isAdmin: 1,
                disabled: 1
            })
                .then(async entUser => {
                    entUser.setCompany(newCompany);

                    res.redirect("/register?success=true");

                    let verifString = cryptoRandomString({ length: 14 });
                    await Verification.create({ EnterpriseUserId: entUser.id, VerificationCode: verifString });

                    const msg = {
                        to: entUser.email,
                        from: "contact@onarrival.uk",
                        subject: "OnArrivalUK - Verify your email address",
                        text: "Dear " + entUser.name + ", Your account has been created successfully! Please press on the link below or copy it to your browser to confirm your email address and start using the app. <a href='https://www.onarrival.uk/verify/" + verifString + "' target='_blank'>https://www.onarrival.uk/verify/" + verifString + "</a> Have a lovely day, OnArrivalUK",
                        html: "Dear " + entUser.name + ", <br /><br />Your account has been created successfully! Please press on the link below or copy it to your browser to confirm your email address and start using the app. <br /><br /><a href='https://www.onarrival.uk/verify/" + verifString + "' target='_blank'>https://www.onarrival.uk/verify/" + verifString + "</a><br /><br />Have a lovely day, OnArrivalUK<br /><img src='https://i.imgur.com/gI3MKyK.jpg' alt='LonAUK Logo'>"
                    }

                    return sgMail.send(msg);
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
        pageTitle: "Assign a Course",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        leaders: employees,
        courses: courses,
        accountData: accountData
    });
};

exports.getChangeAssignCoursePage = async (req, res, next) => {
    const employees = await EnterpriseUser.findAll({ where: { CompanyId: req.session.companyId } });
    const courses = await Course.findAll({ where: { CompanyId: req.session.companyId } });
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/change-assign", {
        pageTitle: "Change a Course Assignment",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        leaders: employees,
        courses: courses,
        accountData: accountData
    });
};

exports.getEnrolStudentPage = async (req, res, next) => {
    const students = await StudentUser.findAll({ where: { CompanyId: req.session.companyId } });
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

exports.getStudentResultsPage = async (req, res, next) => {
    const students = await StudentUser.findAll({ where: { CompanyId: req.session.companyId } });
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];

    res.render("panel/student-results", {
        pageTitle: "View Students' Results",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        students: students,
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
        subject: "OnArrivalUK - You are enroled to a new course",
        text: "Dear " + student.name + ", This is to inform you that you have just been enroled to the " + course.title + " language course designed by your employer. Log in to you OnArrivalUK account to gain access to it and begin improving your English skills. Have a lovely day, OnArrivalUK",
        html: "Dear " + student.name + ", <br /><br />This is to inform you that you have just been enroled to the " + course.title + " language course designed by your employer. Log in to you OnArrivalUK account to gain access to it and begin improving your English skills.<br /><br />Have a lovely day, <br />OnArrivalUK<br /><img src='https://i.imgur.com/gI3MKyK.jpg' alt='LonAUK Logo'>"
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
        req.session.leadingCourse = course;
        req.session.courseTitle = course.title;

        res.redirect("/enterprise/courses/assign?success=true&self=true");
    } else {
        res.redirect("/enterprise/courses/assign?success=true");
    }

    const msg = {
        to: leader.email,
        from: "contact@onarrival.uk",
        subject: "OnArrivalUK - You are now a Course Leader!",
        text: "Dear " + leader.name + ", This is to inform you that you have been appointed a Course Leader of " + course.title + ". Login to your OnArrivalUK account to begin creating exciting content for your employees. Have a lovely day, OnArrivalUK",
        html: "Dear " + leader.name + ", <br /><br />This is to inform you that you have been appointed a Course Leader of " + course.title + ". Login to your OnArrivalUK account to begin creating exciting content for your employees. <br /><br />Have a lovely day, <br />OnArrivalUK<br /><img src='https://i.imgur.com/gI3MKyK.jpg' alt='LonAUK Logo'>"
    }

    return sgMail.send(msg);
};

exports.changeAssignCourse = async (req, res, next) => {
    const course = await Course.findOne({ where: { id: req.body.coursesToAssign } });
    const leader = await EnterpriseUser.findOne({ where: { id: req.body.leadersToAssign } });
    let leaderToUnassign = null;

    try{
        leaderToUnassign = await EnterpriseUser.findOne({ where: { CourseId: course.id } });
        leaderToUnassign.CourseId = null;
        await leaderToUnassign.save();
    } catch(error) { console.log(error); }

    leader.setCourse(course);
    await leader.save();

    course.hasLeader = 1;
    await course.save();

    if(!(leaderToUnassign == null)) {
        if(leaderToUnassign.id == req.session.userId) {
            req.session.isLeader = false;
            req.session.leadingCourse = null;
            req.session.courseTitle = null;

            return res.redirect("/enterprise/courses/change-assign?success=true&self=true");
        }
    }

    if(leader.id == req.session.userId) {
        req.session.isLeader = true;
        req.session.leadingCourse = course;
        req.session.courseTitle = course.title; 

        res.redirect("/enterprise/courses/change-assign?success=true&self=true");
    } else {
        res.redirect("/enterprise/courses/change-assign?success=true");
    }

    const msg = {
        to: leader.email,
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
                html: "Dear " + student.name + ", <br /><br />This is to inform you that your employer has set up an OnArrivalUK account for you. You may soon join an exciting language course which will prepare you for your new position at the company. Use the following credentials to log in and stay tuned for news from your employer. <br /><br /><b>Email</b>: " + student.email + " <br /><b>Password</b>: " + req.body.pass + " <br /><br />Have a lovely day, <br />OnArrivalUK<br /><img src='https://i.imgur.com/gI3MKyK.jpg' alt='LonAUK Logo'>"
            }

            return sgMail.send(msg);
        })
        .catch(error => {
            console.log(error);
            return res.redirect("/enterprise/students/add?success=false");
        })
};


exports.getViewRepresentativesPage = async (req, res, next) => {
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const company = await Company.findOne({ where: { id: req.session.companyId } });

    EnterpriseUser.findAll({ where: { CompanyId: req.session.companyId } })
        .then(leaders => {
            res.render("panel/view-leaders", {
                pageTitle: "View Your Course Leaders",
                isAdmin: req.session.isAdmin,
                isLeader: req.session.isLeader,
                accountData: accountData,
                company: company,
                user: user,
                leaders: leaders
            });
        })
        .catch(error => { console.log(error); })
};

exports.getEditAccountPage = async (req, res, next) => {
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const company = await Company.findOne({ where: { id: req.session.companyId } });

    res.render("panel/edit-account", {
        pageTitle: "Edit Account Details",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        accountData: accountData,
        company: company,
        user: user
    });
};

// Capture new company's data and update the database
exports.updateCompanyDetails = async (req, res) => {
    const company = await Company.findOne({ where: { id: req.session.companyId } });
    company.name = req.query.name;
    company.email = req.query.email;
    company.telNum = req.query.telNum;
    await company.save();

    res.status(201).json({
        success: true
    });
}

exports.updateUserDetails = async (req, res) => {
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    user.name = req.query.name;
    user.surname = req.query.surname;
    user.department = req.query.department;
    user.email = req.query.email;
    if(req.query.password != "") {
        user.password = await bcrypt.hash(req.query.password, 12);
    }
    await user.save();

    req.session.fullName = req.query.name + " " + req.query.surname;

    res.status(201).json({
        success: true
    });
}

exports.getCurrentCompanyName = async (req, res) => {
    const company = await Company.findOne({ where: { id: req.session.companyId } });
    res.status(201).json({
        name: company.name
    });
};

exports.disableLeader = async (req, res) => {
    const leader = await EnterpriseUser.findOne({ where: { id: req.query.id } });
    leader.disabled = 1;
    await leader.save();
    res.status(200).json({
        success: true
    });
};

exports.enableLeader = async (req, res) => {
    const leader = await EnterpriseUser.findOne({ where: { id: req.query.id } });
    leader.disabled = 0;
    await leader.save();
    res.status(200).json({
        success: true
    });
};

exports.disableStudent = async (req, res) => {
    const student = await StudentUser.findOne({ where: { id: req.query.id } });
    student.disabled = 1;
    await student.save();
    res.status(200).json({
        success: true
    });
};

exports.enableStudent = async (req, res) => {
    const student = await StudentUser.findOne({ where: { id: req.query.id } });
    student.disabled = 0;
    await student.save();
    res.status(200).json({
        success: true
    });
};

exports.getViewStudentsPage = async (req, res, next) => {
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const company = await Company.findOne({ where: { id: req.session.companyId } });

    StudentUser.findAll({ where: { CompanyId: req.session.companyId }, include: [Course] })
        .then(students => {
            res.render("panel/view-students", {
                pageTitle: "View Your Students",
                isAdmin: req.session.isAdmin,
                isLeader: req.session.isLeader,
                accountData: accountData,
                company: company,
                user: user,
                students: students
            });
        })
        .catch(error => { console.log(error); })
};

exports.disableCourse = async (req, res) => {
    const course = await Course.findOne({ where: { id: req.query.id } });
    course.disabled = 1;
    await course.save();
    res.status(200).json({
        success: true
    });
};

exports.enableCourse = async (req, res) => {
    const course = await Course.findOne({ where: { id: req.query.id } });
    course.disabled = 0;
    await course.save();
    res.status(200).json({
        success: true
    });
};

exports.disableCompEx = async (req, res) => {
    const exercise = await ComprehensionExercise.findOne({ where: { id: req.query.id } });
    exercise.disabled = 1;
    await exercise.save();
    res.status(200).json({
        success: true
    });
};

exports.enableCompEx = async (req, res) => {
    const exercise = await ComprehensionExercise.findOne({ where: { id: req.query.id } });
    exercise.disabled = 0;
    await exercise.save();
    res.status(200).json({
        success: true
    });
};

exports.disableVocabEx = async (req, res) => {
    const exercise = await VocabularyExercise.findOne({ where: { id: req.query.id } });
    exercise.disabled = 1;
    await exercise.save();
    res.status(200).json({
        success: true
    });
};

exports.enableVocabEx = async (req, res) => {
    const exercise = await VocabularyExercise.findOne({ where: { id: req.query.id } });
    exercise.disabled = 0;
    await exercise.save();
    res.status(200).json({
        success: true
    });
};

exports.disableChapter = async (req, res) => {
    const chapter = await Chapter.findOne({ where: { id: req.query.id } });
    chapter.disabled = 1;
    await chapter.save();
    res.status(200).json({
        success: true
    });
};

exports.enableChapter = async (req, res) => {
    const chapter = await Chapter.findOne({ where: { id: req.query.id } });
    chapter.disabled = 0;
    await chapter.save();
    res.status(200).json({
        success: true
    });
};

exports.getViewCoursesPage = async (req, res, next) => {
    const accountData = [req.session.fullName, req.session.companyName, req.session.courseTitle];
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const company = await Company.findOne({ where: { id: req.session.companyId } });

    Course.findAll({ where: { CompanyId: req.session.companyId } })
        .then(courses => {
            res.render("panel/view-courses", {
                pageTitle: "View Your Courses",
                isAdmin: req.session.isAdmin,
                isLeader: req.session.isLeader,
                accountData: accountData,
                company: company,
                user: user,
                courses: courses
            });
        })
        .catch(error => { console.log(error); })
};

exports.getStudentResults = async (req, res, next) => {
    StudentUser.findOne({ where: { id: req.body.id } })
        .then(student => {
            Score.findAll({ where: { StudentUserId: student.id }, include: [ComprehensionExercise] })
                .then(results => {
                    res.status(200).json({
                        results: results
                    });
                })
                .catch(error => { console.log(error); res.status(500); })
        })
        .catch(error => { console.log(error); res.status(500); })
};

exports.confirmLeaderUnique = async (req, res) => {
    EnterpriseUser.findAll({ where: { email: req.body.email } })
        .then(users => {
            if(users.length == 0) {
                res.status(200).json({
                    unique: true
                });
            } else {
                res.status(200).json({
                    success: false
                });
            }
        })
        .catch(error => { console.log(error); })
};

exports.confirmStudentUnique = async (req, res) => {
    StudentUser.findAll({ where: { email: req.body.email } })
        .then(users => {
            if(users.length == 0) {
                res.status(200).json({
                    unique: true
                });
            } else {
                res.status(200).json({
                    success: false
                });
            }
        })
        .catch(error => { console.log(error); })
};