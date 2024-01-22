import React,{useEffect, useState} from "react"
import Button  from "react-bootstrap/Button";
import axios from "axios";
import { Link, useParams } from "react-router-dom";



const ResetPassword= (props)=>{

  const {verificationToken,verificationEmail} = useParams();
  const [token,setToken]= useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch,setPasswordsMatch] = useState(true)
  
  
  useEffect(() => {
   setUserEmail("");
   setToken("")
   setPassword("")
  }, [verificationToken,verificationEmail])

  
  const handleSubmit=(e)=>{
    e.preventDefault()  
    axios.post(`http://localhost:4000/reset-password`,{token:verificationToken,userEmail:verificationEmail,password},{
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res)=>res.data )
    .then((data)=>{
      alert("Password reset is succesful")
  
    }).catch(e=> alert(JSON.stringify(e)))   
}
  return(
    <div className="relogin">
   <div className="auth-wrapper">
    <div className="auth-inner">
      
   <form onSubmit={handleSubmit}>
         <h3>Reset Password</h3>
            <div className="mb-3">
                <label>Password</label>
                <input type="password" className="form-control"  onChange={(e) => setPassword(e.target.value)} placeholder="Enetr Your Password"/>
           </div>
           {(password.length < 8) && <p className="text-danger">Password length should be atleast 8 characters</p>} <div className="d-grid"></div>
           <div className="mb-3">
                <label>Confirm password</label>
                <input type="password" className="form-control"  onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Enetr Your Password"/>
           </div>
           {!(password == confirmPassword) && <p className="text-danger">Passwords do not match.</p>} <div className="d-grid">
          <Button className="btn-btn-primary" type="submit" disabled={password !== confirmPassword}>Submit</Button>
        </div>
      </form>
      </div>
      </div>
      </div>
      )
      
    }
    export default ResetPassword






