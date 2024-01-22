const bcrypt= require('bcrypt')

const hashPassword = async (password) =>{
    return new Promise((resolve,reject)=>{
        //10 specifies number of round used to generate salt
        bcrypt.genSalt(10,(err,salt)=>{
            if(err){return reject(err);
            }
            bcrypt.hash(password, salt,(error,hash)=>{
                if(error){
                    return reject(error)
                }
                return resolve(hash)
            })
        })
    })
}


const comparePassword = (hashedPassword, password)=>{
    return new Promise((resolve, reject) =>{
        bcrypt.compare(password,hashedPassword, (err, same) => {
            if(err){
                return reject
            }
            //Boolean value "same=true"
            return resolve(same)
        })
    })
}

module.exports = {
    hashPassword,
    comparePassword
}