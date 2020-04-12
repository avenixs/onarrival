const express = require("express");

const enterprise = require("../controllers/enterprise");
const leader = require("../controllers/leader");

const adminRoutes = require("./admin");
const repRoutes = require("./leaders");
const coursesRoutes = require("./courses");
const studentsRoutes = require("./company-students");
const exercisesRoutes = require("./exercises");

const isAdmin = require("../middleware/adminAccess");

let multer  = require('multer');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

let upload = multer({ storage: storage });

const router = express.Router();

router.use("/admin", adminRoutes);

// /representatives => ALL
router.use("/leaders", isAdmin, repRoutes);

// /courses => ALL
router.use("/courses", coursesRoutes);

// /exercises => ALL
router.use("/exercises", exercisesRoutes);

// /students => ALL
router.use("/students", isAdmin, studentsRoutes);

// /panel => GET
router.get("/panel", enterprise.getPanelPage);

// /current-company-name => GET
router.get("/current-company-name", enterprise.getCurrentCompanyName);

// /disable-leader => GET
router.get("/disable-leader", enterprise.disableLeader);

// /enable-leader => GET
router.get("/enable-leader", enterprise.enableLeader);

// /disable-leader => GET
router.get("/disable-student", enterprise.disableStudent);

// /enable-leader => GET
router.get("/enable-student", enterprise.enableStudent);

// /disable-course => GET
router.get("/disable-course", enterprise.disableCourse);

// /enable-course => GET
router.get("/enable-course", enterprise.enableCourse);

// /account/edit => GET
router.get("/account/edit", enterprise.getEditAccountPage);

// /account/update-company => GET
router.get("/account/update-company", enterprise.updateCompanyDetails);

// /account/update-user => GET
router.get("/account/update-user", enterprise.updateUserDetails);

// /materials/add => GET
router.get("/materials/add", leader.getAddMaterialsPage);

// /materials/add => POST
router.post("/materials/add", upload.single("newFile"), leader.addNewMaterial);

// /panel => GET
router.get("/", enterprise.getPanelPage);

module.exports = router;