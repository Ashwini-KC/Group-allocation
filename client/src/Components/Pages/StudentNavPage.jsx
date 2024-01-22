import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewTopic from './ViewTopic';
import ViewStudentGroups from './ViewSupervisorGroups';
import Logout from './Logout';
import StudentPreferences from './StudentPreferences';
import axios from 'axios';

const StudentNavpage = () => {

  const [groups, setGroups] = useState([]);
  const [userData, setUserdata]=useState("");
  const [role, setRole]=useState(null);
  const [userEmail, setUserEmail]=useState("");
  const [token,setToken] = useState(localStorage.getItem('token'));

  const fetchGroups = async() => {
    try{
        const response = await axios.get("http://localhost:4000/groups", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setGroups(response.data.groups)
    } catch(error){
        alert(JSON.stringify(error))
    }
  }

  const userDetails = async ()=> {
    try {
      const response = await axios.get('http://localhost:4000/token/verify', {
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`,
        },
      });

      const { data } = response;
      console.log(JSON.stringify(userData, null, 2))
      setUserdata(data);
      setRole(data.role)
      setUserEmail(data.email)
    } catch (error) {
      console.error('Error fetching User Details :', error);
    }

}
  
  useEffect(() => {
    (async () => {
      await userDetails();
      await fetchGroups();
    })();
  }, [token]);

  return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
  
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
            <li className="nav-item active">
            <a className="nav-link" href="/student">Home </a>
          </li>
            <li className="nav-item">
                <a className="nav-link" href="/viewtopic">View Topics</a>
            </li>
            {
              (groups.length == 0) && <li>
              <a className="nav-link" href="/studentpreferences"> Preferences</a>  
            </li>
            }
            {
              (groups.length != 0) &&
            <li>
              <a className='nav-link' href="/viewstudentgroups">View Group</a>
            </li>
            }
        </ul>
      </div>
        <Logout></Logout>
    </nav>
    )
}

export default StudentNavpage