const { verify } = require("jsonwebtoken")
const User = require("../models/user.model")
const JWT_SECRET=process.env.JWT_SECRET || "THIS IS MY JWT SECRET"

const verifyToken= (req,res,next)=>{
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]
    if (!token){
        return res.sendStatus(401)
    }
    verify(token, JWT_SECRET, async (error, user) => {
        if(!error){
            var userExists = await User.findByPk(user.email);
        }
        if (error || !userExists) return res.status(401).json({ error: "Unauthorized"});
        req.user = user;
        next()
    })
}

const adminVerify = (req,res,next) => {
    const { user } = req;
    const isAdmin = user.role == "Admin"
    if(!isAdmin) return res.status(401).json({ error: "User trying to access is not admin"})
    next()
}

const studentVerify =(req,res,next)=>{
    const { user } = req;
    const isStudent =user.role == "Student";
    if(!isStudent) return res.status(401).json({error: "Please log in as Student"})
    next()
}

const supervisorVerify =(req,res,next)=>{
    const user = req.user
    const isSupervisor = user.role == "Supervisor"
    if(!isSupervisor) return res.status(401).json({error: "Please log in as Supervisor"})
    next()
}

const adminOrSupervisorVerify = (req, res, next) => {
    const { user } = req;
    const isAdmin = user.role == "Admin" || "Supervisor"
    if(!isAdmin) return res.status(401).json({ error: "Please log in as admin"})
    next()
}

const adminOrStudentVerify = (req, res, next) => {
    const { user } = req;
    const isAdmin = user.role == "Admin" || "Student"
    if(!isAdmin) return res.status(401).json({ error: "Please log in as admin"})
    next()
}
module.exports = {
    verifyToken,
    adminVerify,
    supervisorVerify,
    studentVerify,
    adminOrSupervisorVerify,
    adminOrStudentVerify
}


