const User = require('../models/user.model')
const {comparePassword} = require('../utils/passwordEncrypt');
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "THIS IS MY JWT SECRET"

const login = async (req,res) => {
    try {
        const { email, password } = req.body;
    
        const foundUser = await User.findOne({
          where: { email },
          attributes: ['email', 'password', 'role', 'verified'], 
        });
    
        if (!foundUser) {
          return res.status(404).json({ error: 'User not found.' });
        }
        
        if(!foundUser.verified){
          // console.log(foundUser.verified)
          return res.status(403).json({ error: "Please verify email."});
        }
        // Compare the provided password with the hashed password in the database
        if(await comparePassword(foundUser.password, password) && foundUser){
            // Create a jwt token
            const token=jwt.sign({ email, role:foundUser.role, verfied: foundUser.verified }, JWT_SECRET)
            const role=foundUser.role;
            return res.json({ message: `Logged in as ${foundUser.email}`, token,role, verified: foundUser.verified})
         }
    
        
         return res.status(401).json({ error: "Password incorrect."})
      } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'An error occurred during login.' });
      }
}


module.exports = {
    login,
 }