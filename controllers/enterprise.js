const EnterpriseUser = require("../models/enterprise-user");
const Company = require("../models/company");
const bcrypt = require("bcryptjs");

exports.getPanelPage = (req, res, next) => {
    res.render("panel/company-main", {
        pageTitle: "Main Panel"
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
        pageTitle: "Add a New Representative"
    });
};

exports.addNewRepresentative = (req, res, next) => {
    // Add to DB
};

exports.getViewRepresentativesPage = (req, res, next) => {
    res.render("panel/view-representatives", {
        pageTitle: "View Your Representatives"
    });
};