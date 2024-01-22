import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentNavpage from './StudentNavPage';
import { useNavigate } from 'react-router-dom';

const StudentPreferences = () => {
  const [preferences, setPreferences] = useState({ first: null, second: null, third: null, fourth: null });
  const [topics, setTopics] = useState([]);
  const [studentPreferences, setStudentPreferences] = useState([]);
  const [userData, setUserdata]=useState("");
  const [role, setRole]=useState(null);
  const [userEmail, setUserEmail]=useState("");
  const [deadline, setDeadline] = useState(false);
  const token = window.localStorage.getItem('token');
  const email = window.localStorage.getItem('email');


  useEffect(() => {
    userDetails();
    fetchTopics();
    getPreferences();
    getDeadline();
  }, [preferences]);


  const getDeadline = () => {
    axios.get('http://localhost:4000/deadline', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }). then(res => res.data).then(data => setDeadline(data.deadline < Date.now())).catch(e => console.log(e))
  }

  const getPreferences = async () => {
    try {
      const response = await fetch(`http://localhost:4000/preferences?userEmail=${email}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
       
        },
       
      });
      const studentPreference = await response.json();
      setStudentPreferences(studentPreference);
      console.log(studentPreference);
    }
   catch (error) {
    console.error('Error fetching topics:', error);
  }
  }


  const userDetails = async ()=> {
    try {
      const response = await fetch('http://localhost:4000/token/verify', {
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(JSON.stringify(userData, null, 2))
      setUserdata(data);
      setRole(data.role)
      setUserEmail(data.email)
       
      console.log(userData);
      console.log(userEmail);
    
    } catch (error) {
      console.error('Error fetching User Details :', error);
    }

}
  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:4000/topics', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const topicsData = await response.json();
      setTopics(topicsData);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem('token');
    console.log(preferences)
    axios
      .post(`http://localhost:4000/preferences`, preferences, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        alert(data.message);
        setPreferences({ first: null, second: null, third: null, fourth: null })
      })
      .catch((e) => alert(e.response.data.error));
  };

  const handlePriorityChange = (topicId, priorityKey) => {
    const newPreferences = { ...preferences };
    Object.keys(newPreferences).forEach((key) => {
      if (newPreferences[key] === topicId) {
        newPreferences[key] = null;
      }
    });
    setPreferences({ ...newPreferences, [priorityKey]: topicId });
  };

  return (
    <div>
      <h3 className="text-center">Allocation of Students to Groups</h3>
      <StudentNavpage />
      <div>
        <h5>Preferences</h5>
        <div>
      
            
            <label> Current Preference</label>
           
          
          <ol>
            {studentPreferences.map((preference, index) => (
              <li key={index}>{preference.topic.title}</li>
            ))}
          </ol>
       
        </div>
        
      </div>
      <table className="table table-striped table-hover">
        <tbody>
          <tr>
            <th>
              Topic Code
              </th>
            <th>
              Topic Title
              </th>
            <th>
              Supervisor
              </th>
              {
                ! deadline && <th>
                Preferences
                </th>
              }
          </tr>
          {topics.map((topic) => (
            <tr key={topic.id}>
              <td>
                {topic.id}
                </td>
              <td>
                {topic.title}
                </td>
              <td>{
              topic.userEmail}
              </td>
              {
                !deadline && (
                  <td>
                <select
                  onChange={(e) => {
                    const selectedPriority = e.target.value;
                    handlePriorityChange(topic.id, selectedPriority);
                  }}
                  value={Object.keys(preferences).find((key) => preferences[key] === topic.id) || ''}
                >
                  <option value="">Select your option</option>
                  {Object.keys(preferences).map((priorityKey, index) => (
                    <option key={priorityKey} value={priorityKey}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </td>
                )
              }
            </tr>
          ))}
        </tbody>
      </table>
      {
        ! deadline && <button onClick={handleSubmit} class="btn btn-success text-center" style = {{cursor : 'pointer'  }}>Submit</button>
      }
    </div>
  );
};

export default StudentPreferences;
