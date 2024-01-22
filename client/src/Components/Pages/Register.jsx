import React,{useState} from "react"
import axios from "axios";
import Button  from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';

import {ReLogin} from "./ReLogin.css"
import { useNavigate } from "react-router-dom";



const Register = (props)=>{
    const [email,setEmail]= useState('');
    const [password,setPassword]= useState('');
    const [name,setName]= useState('');
    const [role,setRole]=useState('')
    const [department,setDepartment]= useState('')
    const [course,setCourse]= useState('')
    const [passwordError, setPasswordError] = useState('');

    const [isValid, setIsValid] = useState(false);

    const handleSubmit=(e)=>{
      e.preventDefault()
      if(role === "Supervisor"){
        if(!email.includes("leicester.ac.uk"))
        {
          alert("Please enter a valid user email. Ending with \"@student.le.ac.uk\" or \"@leicester.ac.uk\"")
          return
        }
        axios.post(`http://localhost:4000/register`, { name, email, password,department,role}, {
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => res.data).then(data => console.log(data) ).then(data => alert(`Registered as ${role}`)).catch(err => alert(JSON.stringify(err)))

      }
      else if(role === "Student"  ) { 
        if(!email.includes("student.le.ac.uk"))
        {
          alert("Please enter a valid user email. Ending with \"@student.le.ac.uk\" or \"@leicester.ac.uk\"")
          return
        }
        e.preventDefault()
        axios.post(`http://localhost:4000/register`, { name, email, email, password, department,course,role}, {
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => res.data).then(data => console.log(data) ).then(data => alert(`Registered as ${role}`)).catch(err => alert(JSON.stringify(err)))

       
      }
      
    }

    const handlePasswordStrength= (e) =>{
      const passwordStrength = e.target.value;
      setPassword(e.target.value)
      if (passwordStrength.length < 8 || !/\d/.test(passwordStrength) || !/[!@#$%^&*]/.test(passwordStrength)) {
        setPasswordError('Password must be at least 8 characters long, contain at least one digit, and one special character');
      } else {
        setPasswordError('');
      }
  
      setPassword(passwordStrength);
    };
    

    return(
      <div className="relogin">
      <div className="auth-wrapper">
        <div className="auth-inner">
      <form onSubmit={handleSubmit}>
        <h3>Register</h3>


        <div className="mb-3">
          <label>Full Name</label>
          <input type="text" required className="form-control" onChange={(e) => setName(e.target.value)} placeholder="Enter your Full Name"/>
        </div>

        <div className="mb-3">
          <label>Email Address</label>
          <input aria-describedby="emailHelp" type="email" className="form-control"  onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email Address"/>
          {/* {role === "Supervisor" ? <small id="emailHelp" class="form-text text-muted">Please Include supervisor.le.ac.uk</small>  : role === "Student" ?<small id="emailHelp" class="form-text text-muted">Please Include student.le.ac.uk</small>: null} */}
        </div>


        <div className="mb-3">
          <label>Password</label>
          {/* <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password"/> */}
          <input type="password" className="form-control" onChange={handlePasswordStrength} placeholder="Enter your Password"/>
          {passwordError && <p className="text-danger">{passwordError}</p>}
        </div>


        <div className="mb-3">
          <label>Department</label>
          <input required type="text" className="form-control" onChange={(e) => setDepartment(e.target.value)} placeholder="Enter your Department"/>
        </div>

        { (role == 'Student' && role !== "") &&
        <div className="mb-3">
          <label>Course</label>
          <input required type="text" className="form-control" onChange={(e) => setCourse(e.target.value)} placeholder="Enter your Course"/>
        </div>
        }

       <div className="d-grid">
          

  <div className="form-check">
  <input onChange={(e) => setRole(e.target.value)} type="radio" className="form-check-input" id="supervisor" name="role" value="Supervisor" />
  <label className="form-check-label" for="supervisor">Supervisor</label>

</div>
<div className="form-check">
  <input onChange={(e) => setRole(e.target.value)} type="radio" className="form-check-input" id="student" name="role" value="Student"/> 
  <label className="form-check-label" for="student">Student</label>
  
</div>
      </div>

        <div className="d-grid">
          <Button className="btn-btn-primary" type="submit">Register</Button>
        </div>

        
        <p className="forgot-password text-right">
          Registered?<a href="/Login">Login</a>
        </p>
      </form>
      </div>
      </div>
      </div>
    )
        
}

export default Register;