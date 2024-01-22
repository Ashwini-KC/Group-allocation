const { Router } = require("express");
const { verifyToken, studentVerify, adminOrStudentVerify } = require("../middleware/auth");
const { postPreference, updatePreferences, getPreferences } = require("../controllers/preferences.controller");



const router = Router()

router.post("/",adminOrStudentVerify,postPreference)
// router.put("/:userEmail", studentVerify,updatePreferences)
router.get("/",adminOrStudentVerify,getPreferences)

module.exports=router;