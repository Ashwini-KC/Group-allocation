
import React from 'react'
import { useEffect, useState } from 'react'
import axios from "axios";
import Button  from "react-bootstrap/Button";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const Logout = () => {

  useEffect(() => {
    userDetails();

  }, []);
  const [userData, setUserdata] = useState(false);
    const [role, setRole] = useState(false);
    const [userEmail, setUserEmail]=useState("");
    const token = window.localStorage.getItem('token');

    const logout=()=>{
        window.localStorage.clear();
        window.location.href="./login"
      }

      const userDetails = async ()=> {
        try {
          const response = await fetch('http://localhost:4000/token/verify', {
            headers: {
              'Content-Type': 'application/json',
              Authorization : `Bearer ${token}`,
            },
          });
    
          const userData = await response.json();
          setUserdata(userData);
          setRole(userData.role)
          setUserEmail(userData.email)
          window.localStorage.setItem("email", userData.email)
        } catch (error) {
          console.error('Error fetching User Details :', error);
        }
    
      }

  return (

    <div>  
    
      <PersonOutlineIcon></PersonOutlineIcon>
      {userEmail}
    
     <div>
    
        <LogoutIcon className="logout-btn" onClick={logout}></LogoutIcon>
    
      <span>Logout</span>
    </div>
    </div>
   
  )
}

export default Logout