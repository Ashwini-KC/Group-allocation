import React,{useEffect, useState} from "react"
import axios from "axios";
import Button  from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useParams } from "react-router-dom";


const Verify = () =>{
    const {verificationToken,verificationEmail} = useParams();
    const [verified, setVerified] = useState(false);
    useEffect(() => { 
        if(verificationEmail){
            axios.post('http://localhost:4000/verify/user',
            {token:verificationToken,userEmail:verificationEmail}
            )
            .then(res => res.data)
            .then(data => setVerified(data.verified))
            .catch(err => alert(err.response? err.response.data.error: err.message))
        }
    }, [verificationToken,verificationEmail])

    return(
        <div className="relogin">
        <div className="auth-wrapper">
          <div className="auth-inner">
            {
                verified ?<>
                    <h1>Verified. Please log in</h1> 
                    <Link to="/login">Login</Link>
                </>: <>
                <h1>Not verified. Please register again.</h1>
                <Link to="/register">Register</Link>
                </>
            }
          </div>
          </div>
          </div>
    )
}
export default Verify