const { Router } = require("express");
const crypto = require('crypto');


const register = require('../controllers/registration.controller');
const {verify} = require("../controllers/auth.controller");
const { login } = require('../controllers/login.controller')
const { verifyToken, adminVerify ,studentVerify,supervisorVerify} = require("../middleware/auth");

const topicRoutes = require('./topics.routes');
const preferenceRoutes= require('./preferences.routes');
const userRoutes = require('./viewStudentsSupervisor.routes');

const { viewStudents , viewSupervisors, deleteStudents,deleteSupervisors, updateStudents, updateSupervisors} = require('../controllers/viewUsers.controller');
const { findTopicsByPriority } = require("../controllers/algorithm.controller");

const {getGroups, deleteGroups, getStudentGroup, getSupervisorGroup} = require("../controllers/groups.controller")

const { postAnnouncement, getAnnouncements, deleteAnnouncements, updateAnnouncements } = require("../controllers/announcement.controller");
const { comparePassword, hashPassword } = require("../utils/passwordEncrypt");
const Token = require("../models/token.model");
const db = require("../config/dbConfig");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const Topic = require("../models/topic.model");
const emailSender = require("../utils/emailService");

const router = Router();

var deadline = Date.now();

router.post("/login", login)

router.get("/token/verify", verify)

router.get("/viewStudents",viewStudents)

router.get("/viewSupervisors",viewSupervisors)

router.delete("/deleteStudents", verifyToken, adminVerify, deleteStudents)

router.delete("/deleteSupervisors", verifyToken, adminVerify, deleteSupervisors)

router.put("/updateStudents",verifyToken,adminVerify,updateStudents)

router.put("/user", verifyToken,adminVerify, updateSupervisors)

router.post("/register", register)

router.use("/topics", verifyToken,topicRoutes)

router.use("/preferences",verifyToken,preferenceRoutes)

router.use("/user",verifyToken,userRoutes)

router.post("/allocate", verifyToken, adminVerify, findTopicsByPriority)

router.get("/groups", getGroups)

router.get("/groups/student",verifyToken,studentVerify,getStudentGroup)

router.get("/groups/supervisor",verifyToken,supervisorVerify,getSupervisorGroup)

router.delete("/groups",verifyToken, adminVerify, deleteGroups)

router.post("/announcement", verifyToken,adminVerify,postAnnouncement)

router.get("/announcement", getAnnouncements)

router.delete("/announcement/:id",verifyToken,adminVerify,deleteAnnouncements)

router.put("/announcement/:id",verifyToken,adminVerify,updateAnnouncements)

router.post("/verify/user", async (req, res) => {
    const token = req.body.token;
    const userEmail = req.body.userEmail;

    const dbToken = await Token.find({
        where: {
            userEmail,
            token
        }
    });

    if(! dbToken){
        return res.status(500).json({ error: "Something went wrong. Please register again."})
    }

    const isMatch = dbToken.token == token;

    if (isMatch){
        await User.update({ verified: true }, {
            where: {
                email: userEmail
            }
        })

        res.json({
            message: "User verified.",
            verified: isMatch
        })
    }
    else{
        await User.destroy({
            where: {
                email: userEmail
            }
        });

        res.json({
            message: "User not verified. Please register again.",
            verified: isMatch
        })
    }
})

router.post('/deadline', verifyToken, adminVerify, (req, res) => {
    deadline = Date.parse(req.body.deadline);

    res.json({ message: "Deadline set.", deadline})
})

router.get('/deadline', (req, res) => {
    res.json({ deadline });
})

router.post("/notify",
verifyToken,adminVerify,
 async(req, res) => {
    try{
        const user = req.user;
        const studentGroups = await Group.findAll({
            include: [
                {
                    model: Topic,
                    attributes: ['title', 'userEmail']
                },
                {
                    model: User,
                    attributes: ['email'],
                }
            ],
            through: {
                attributes: []
            }
        });
        const group = studentGroups.find(group => group.users.find(u => u.email == 'akc17@student.le.ac.uk' ));


        if(group != {}){

            const formattedGroup = {
                id: group.id,
                supervisor: group.topic.userEmail,
                topic: {
                    id: group.topicId,
                    title: group.topic.title
                },
                students: group.users.map(u => u.email)
            };
                const message = `
<h1>Group Number: ${formattedGroup.id}</h1>
<h2>Title: ${formattedGroup.topic.title}</h2>
<h3>Supervisor: ${formattedGroup.supervisor}</h3>
<h3>Group members: </h3>
<ul>
    ${formattedGroup.students.map(student => `<li>${student}</li>`)}
</ul>
`
                const response = await emailSender(
                    [{ address: 'akc17@student.le.ac.uk', displayName: "Ashwini KC",}],
                    "Groups have been allocated",
                    message);
            }
        res.json({message: "Email Sent"});
    }
    catch(error){
        console.log(error)
        res.status(500).json({error: 'Server Error'})
    }
})


router.post("/forgot-password", async (req, res) => {
    const email = req.body.email;
    const foundUser = await User.findOne({
        where: { email },
        attributes: ['email', 'role', 'verified'], 
      });
  
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
    //   console.log(foundUser);
      if(!foundUser.verified){
        console.log(foundUser.verified)
        return res.status(403).json({ error: "Please verify email."});
      }
        const token = crypto.randomBytes(20).toString('hex');
        // console.log(token);
        const createdToken = await Token.create({ token: token, userEmail: email });

        const message = `
        <h1>Verify</h1>
        Please use the below link to Reset your passowrd.
        <a href="http://localhost:3000/reset-password/${token}/${email}">Reset</a>
        If the above link doesn't work, please use the below link.
        http://localhost:3000/reset-password/${token}/${email}
        `

        const response = await emailSender(
            [{ address: 'akc17@student.le.ac.uk', displayName: "Ashwini KC",}],
            "Password Reset Link",
            message);
        // console.log(message);
    res.json({ message: "Email sent", email, createdToken})
});

router.post("/reset-password", async (req, res) => {
    const userEmail= req.body.userEmail;
    const token = req.body.token;
    const password = req.body.password;
    const dbToken = await Token.findOne({
        where: {
            token
        }
    });
    // console.log(dbToken.toJSON())
    if(!dbToken){
        return res.status(400).json({message: "Invalid Link"});
    }
    if((dbToken.userEmail != userEmail)){
        await Token.destroy({
            where: {
                userEmail
            }
        });
        return res.status(400).json({message: "Link expired"});
    }
    const newPassword = await hashPassword(password);
    await User.update({password: newPassword}, {where: { email: userEmail }});
    await Token.destroy({where: {token}})
    res.json({message: "Password changed. Please login"})

})


module.exports = router




