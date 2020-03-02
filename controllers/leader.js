const EnterpriseUser = require("../models/enterprise-user");
const Company = require("../models/company");
const Course = require("../models/course");
const Chapter = require("../models/chapter");
const StudentUser = require("../models/student-user");
const bcrypt = require("bcryptjs");

exports.getAddChapterPage = async (req, res, next) => {
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const course = await Course.findOne({ where: { id: user.CourseId } });

    const allChapters = await Chapter.findAll({ where: { CourseId: course.id } })

    res.render("panel/add-chapter", {
        pageTitle: "Add a New Chapter",
        isAdmin: req.session.isAdmin,
        isLeader: req.session.isLeader,
        success: req.query.success,
        course: course,
        chapters: allChapters
    });
};

exports.addChapter = async (req, res, next) => {
    const user = await EnterpriseUser.findOne({ where: { id: req.session.userId } });
    const course = await Course.findOne({ where: { id: user.CourseId } });

    Chapter.create({
        title: req.body.title,
        number: req.body.number,
        theme: req.body.theme,
        description: req.body.description 
    })
        .then(async addedChapter => {
            await addedChapter.setCourse(course);

            return res.redirect("/enterprise/courses/chapters/add?success=true");

        })
        .catch(error => { console.log(error); })
};
