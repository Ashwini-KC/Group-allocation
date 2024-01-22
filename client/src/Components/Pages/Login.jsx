import React,{useEffect, useState} from "react"
import axios from "axios";
import Button  from "react-bootstrap/Button";



const Login= (props)=>{
  const [email,setEmail]= useState('');
  const [password,setPassword]= useState('');
  
  useEffect(() => {
    setEmail("")
    setPassword("")
  }, [])



  
  const handleSubmit=(e)=>{
    e.preventDefault()
    axios.post(`http://localhost:4000/login`, { email, password }, {
      headers: {
        "Content-Type": "application/json",
      }
    // }).then(res => res.data ).then(data => console.log(data.role, data.token)).catch(e => console.log(e) )
    }).then((res)=>res.data )
    .then((data)=>{
      window.localStorage.setItem("token", data.token)
      if(data.role === 'Supervisor'){
        alert("Logged in as Supervisor")
        window.location.href="./supervisor"
        
      }
      else if(data.role === 'Student'){
        alert("Logged in as student")
        window.location.href="./student"
      }else if(data.role === 'Admin'){
        alert("Logged in as Admin")
        window.location.href="./admin"
      }
      else{
        alert("Something went wrong!! Please try again")
      }
    
     
    }).catch(e=> alert(e.response.data.error))
    
    
}
  return(
    <div className="relogin">
   <div className="auth-wrapper">
    <div className="auth-inner">
      
   <form onSubmit={handleSubmit}>
         <h3>Login</h3>
            <div className="mb-3">
                <label>Email Address</label>
                <input type="email" className="form-control"  onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email Address"/>
           </div>


        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password"/>
        </div>
        <p className="forgot-password text-right">
        <a href="/forgot-password"> Forgot Password? </a>
        </p>


        <div className="d-grid">
          <Button className="btn-btn-primary" type="submit">Login</Button>
        </div>

        
        <p className="forgot-password text-right">
          Not Registered?<a href="/register">Register</a>
        </p>
      </form>
      </div>
      </div>
      </div>
      )
      
    }
    export default Login






