const User = require('../models/user.model')
const {comparePassword} = require('../utils/passwordEncrypt');
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "THIS IS MY JWT SECRET"

const login = async (req,res) => {
    try{
     const{ email, password} = req.body
     
    const foundUser = await User.findByPk(email)
     
     if(!foundUser){
        throw Error("User not found")
     }

      if(await comparePassword(foundUser.password, password) && foundUser){
        // Create a jwt token
        const token=jwt.sign({ email, role:foundUser.role}, JWT_SECRET)
        const role=foundUser.role;
        
        return res.json({ message: `Logged in as ${foundUser.email}`, token,role, foundUser})
     }

    throw Error("Password incorrect")
    }
     catch(e){
        return res.status(401).json({error:e.message})
    }
}


const verify = (req, res) => {
   try {
      const token = req.headers.authorization && req.headers.authorization.split(" ")[1]
      if (!token){
         return res.sendStatus(401)
      }
      jwt.verify(token, JWT_SECRET, (error, user) => {
         if (error)return res.status(401).json({ error: "Invalid Token"})
         return res.json(user)
      })
   } catch(error){
      return res.json(error)
   }
}

module.exports = {
   login,
   verify
}