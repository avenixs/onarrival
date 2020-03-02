const EnterpriseUser = require("../models/enterprise-user");
const Company = require("../models/company");
const Course = require("../models/course");
const StudentUser = require("../models/student-user");
const bcrypt = require("bcryptjs");

exports.getPanelPage = (req, res, next) => {
    res.render("panel/company-main", {
        pageTitle: "Main Panel",
        isAdmin: req.session.isAdmin
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
    res.render("panel/add-representative", {
        pageTitle: "Add a New Representative",
        isAdmin: req.session.isAdmin,
        success: req.query.success
    });
};

exports.getAddCoursePage = (req, res, next) => {
    res.render("panel/add-course", {
        pageTitle: "Add a New Course",
        isAdmin: req.session.isAdmin,
        success: req.query.success
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

            return res.redirect("/enterprise/representatives/add?success=true");
        })
        .catch(error => {
            console.log(error);
            return res.redirect("/enterprise/representatives/add?success=false");
        })
};

exports.getAssignCoursePage = async (req, res, next) => {
    const employees = await EnterpriseUser.findAll({ where: { CompanyId: req.session.companyId, CourseId: null } });
    const courses = await Course.findAll({ where: { CompanyId: req.session.companyId, hasLeader: 0 } });

    res.render("panel/assign-course", {
        pageTitle: "Add a New Course",
        isAdmin: req.session.isAdmin,
        success: req.query.success,
        leaders: employees,
        courses: courses
    });
};

exports.getEnrolStudentPage = async (req, res, next) => {
    const students = await StudentUser.findAll({ where: { CompanyId: req.session.companyId, CourseId: null } });
    const courses = await Course.findAll({ where: { CompanyId: req.session.companyId } });

    res.render("panel/enrol-student", {
        pageTitle: "Enrol a Student to a Course",
        isAdmin: req.session.isAdmin,
        success: req.query.success,
        students: students,
        courses: courses
    });
};

exports.enrolStudent = async (req, res, next) => {
    const course = await Course.findOne({ where: { id: req.body.coursesToAssign } });
    const student = await StudentUser.findOne({ where: { id: req.body.studentsToAssign } });

    student.setCourse(course);
    student.save();

    return res.redirect("/enterprise/students/enrol?success=true");
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
    leader.save();

    course.hasLeader = 1;
    course.save();

    return res.redirect("/enterprise/courses/assign?success=true");
};

exports.getAddStudentPage = async (req, res, next) => {
    res.render("panel/add-student", {
        pageTitle: "Add a New Student",
        isAdmin: req.session.isAdmin,
        success: req.query.success
    });
};

exports.addNewStudent = async (req, res, next) => {
    const company = await Company.findOne({ where: { id: req.session.companyId } });

    StudentUser.create({
        email: req.body.email,
        password: req.body.pass,
        name: req.body.name,
        surname: req.body.surname,
        nationality: req.body.nationality,
        dateOfBirth: req.body.dateOfBirth,
    })
        .then(student => {
            student.setCompany(company);

            return res.redirect("/enterprise/students/add?success=true");
        })
        .catch(error => {
            console.log(error);
            return res.redirect("/enterprise/students/add?success=false");
        })
};


exports.getViewRepresentativesPage = (req, res, next) => {
    res.render("panel/view-representatives", {
        pageTitle: "View Your Representatives",
        isAdmin: req.session.isAdmin,
        success: req.query.success
    });
};