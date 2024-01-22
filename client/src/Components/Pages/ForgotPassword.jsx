import React,{useEffect, useState} from "react"
import Button  from "react-bootstrap/Button";
import axios from "axios";
import { Link, useParams } from "react-router-dom";



const ForgotPassword= (props)=>{
  const [email,setEmail]= useState('');
  const {verificationToken,verificationEmail} = useParams();
  
  
  useEffect(() => {
    // setEmail("")
    console.log(verificationToken,verificationEmail);
  
  }, [verificationToken,verificationEmail])


  
  const handleSubmit=(e)=>{
    e.preventDefault()
    axios.post(`http://localhost:4000/forgot-password`, { email }, {
      headers: {
        "Content-Type": "application/json",
      }
    // }).then(res => res.data ).then(data => console.log(data.role, data.token)).catch(e => console.log(e) )
    }).then((res)=>res.data )
    .then((data)=>{
      alert("Reset link has been sent your email address.")
  
    }).catch(e=> alert(e.response.data.error))
    
    
}
  return(
    <div className="relogin">
   <div className="auth-wrapper">
    <div className="auth-inner">
      
   <form onSubmit={handleSubmit}>
         <h3>Reset Password</h3>
            <div className="mb-3">
                <label>Email Address</label>
                <input type="email" className="form-control"  onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email Address"/>
           </div>
       


        <div className="d-grid">
          <Button className="btn-btn-primary" type="submit">Send Link</Button>
        </div>

        
      
      </form>
      </div>
      </div>
      </div>
      )
      
    }
    export default ForgotPassword






