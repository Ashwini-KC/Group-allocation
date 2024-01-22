const { hashPassword } = require('../utils/passwordEncrypt');
const User = require("../models/user.model");
const crypto = require('crypto');
const Token = require('../models/token.model');
const emailSender = require('../utils/emailService');

const registration = async (req,res) => {
    try{
        const { name, email,password,department,course,role, verified } = req.body;
        if (
            (role === "Student" && !email.endsWith("@student.le.ac.uk")) ||
            (role === "Supervisor" && !email.endsWith("@leicester.ac.uk"))
        ) 
        {
            return res.status(400).json({ error: "Invalid email forma!!! Supervior? use '@leicester.ac.uk' ,Student? use '@student.le.ac.uk'." });
        }

    
        const hashedPassword = await hashPassword(password);

        
        
        const user = await User.create({name, email, password: hashedPassword,department,course,role, verified: false})
        const token = crypto.randomBytes(20).toString('hex');
        console.log(token);
        await Token.create({ token: token, userEmail: email });

        const message = `
        <h1>Verify</h1>
        <p>Your password is ${password}</p>
        Please verify your account by clicking on the link below.
        <a href="http://localhost:3000/verify/${token}/${email}">Verify</a>
        If the above link doesn't work, please use the below link.
        http://localhost:3000/verify/${token}/${email}
        `

        const response = await emailSender(
            [
                {
                    address: email,
                    displayName: name
                }
            ],
            "Verify Group Allocation App",
            message);
        return res.status(201).json({name,email,department,course,role})
       
    } catch(e){
        // console.log
        if(e.name == "SequelizeValidationError"){
            return res.status(400).json({error: e.errors[0].message})
        }
        if( e.name == "SequelizeUniqueConstraintError"){
            return res.status(400).json({ error: e.parent.sqlMessage})
        }
        if(e.name == "SequelizeDatabaseError"){
            console.log(e);
            return res.status(400).json({ error: "Role can only be Admin, Supervisor, or Student"})
        }
        res.status(500).json({ error: e})
    }
}

module.exports = registration
