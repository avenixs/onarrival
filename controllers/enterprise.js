exports.getPanelPage = (req, res, next) => {
    res.render("panel/company-main", {
        pageTitle: "Main Panel"
    });
};