const { Router } = require("express")
const { verifyToken, studentVerify, adminOrStudentVerify, adminVerify } = require("../middleware/auth");
const { searchStudents, searchSupervisors } = require("../controllers/viewUsers.controller");

const router = Router()

router.get('/searchStudents',adminVerify,searchStudents)

router.get('/searchSupervisors',adminVerify,searchSupervisors)

module.exports = router;