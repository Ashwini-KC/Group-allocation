import React from 'react'
import axios from "axios";
import { useEffect, useState } from 'react'
import AdminNavPage from './AdminNavPage';
import Form from 'react-bootstrap/Form';
import { Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useNavigate } from 'react-router-dom';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import SearchIcon from '@mui/icons-material/Search';

import { Dialog } from 'primereact/dialog';
import { EmailOutlined } from '@mui/icons-material';



const ViewUsers = () => {
    const [students, setStudents] = useState([]);
    const [userData, setUserdata] = useState(false);
    const [role, setRole] = useState(false);
    const [show, setShow] = useState(false);
    const [studentName, setStudentName] = useState("")
    const [studentDepartment, setStudentDepartment] = useState('')
    const [email, setEmail] = useState();
    const [studentCourse, setStudentCourse] = useState('')
    const navigate = useNavigate();
    const [userEmail, setUserEmail]=useState("");
    const [ preference, setPreference] = useState([])
    const [visible,setVisible] = useState(false);
    const [visiblePreference,setVisiblePreference] = useState(false);
    const [studentEmail, setStudentEmail]=useState("");
    const [topics, setTopics] = useState([]);
    const [preferences, setPreferences] = useState({ first: null, second: null, third: null, fourth: null });
    const [studentPreferences, setStudentPreferences] = useState([]);
    const [searchContent, setSearchContent] = useState('')
    //const [preferenceStudentEmail, setPreferenceStudentEmail] = useState("");
    const token = window.localStorage.getItem('token');
    const [deadline, setDeadline] = useState('');
    
   
    // const [studentPreferences, setStudentPreferences] = useState([]);
    

    useEffect(() => {
        // setToken(localStorage.getItem('token'));
        // userDetails();    
        fetchStudents();
        fetchTopics();
        getDeadline();
       
       
    },[]);

    const getDeadline = () => {
      axios.get('http://localhost:4000/deadline', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      }). then(res => res.data).then(data => setDeadline(new Date(data.deadline).toISOString().split("T")[0])).catch(e => console.log(e))
    }
  

    const fetchStudents = async () => {
        try{
            const response = await fetch('http://localhost:4000/viewStudents',{
                headers : {
                    'Content-Type' : 'application/json'
                },
            })
        
   
    if(!response.ok) {
            throw new Error('Response was not ok');
    }

    const studentsData = await response.json();
    setStudents(studentsData);
    
}catch (error) {
    console.log('Error fetching students:', error)
}
};

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
  
    
    } catch (error) {
      console.error('Error fetching User Details :', error);
    }

}

  const updateStudents = async () => {
    try{
        const body = {name: studentName, email: email, department: studentDepartment,course: studentCourse}
        console.log(body);
        const response = await axios.put(`http://localhost:4000/updateStudents`,body,{
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });

        if (response.status === 200) {
            alert('Students updated successfully.');
            handleClose();
            fetchStudents();
          } else {
            throw new Error('Error updating the Students.');
          }
    }catch (error) {
        alert(error);
    }
  }

  const handleClose = () => setShow(false);
  const handleClosePreference = () => setVisible(false);
  const handleCloseSetPreference = () => setVisiblePreference(false);
  const handleShow = (name,dep,course,email) => {
    setStudentName(name);
    setStudentDepartment(dep);
    setStudentCourse(course);
    setShow(true)
    console.log(show);
    setEmail(email)
  };

  const handleDelete = async() => {
    try{
        const response = await axios.delete(`http://localhost:4000/deleteStudents`,
        {
            data: { email}, 
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });

        if (response.status === 200) {
            alert('Student deleted successfully.');
            handleClose();
            fetchStudents();
          } else {
            throw new Error('Error deleting the Student.');
          }
    }catch (error) {
        alert(JSON.stringify(error, null, 2))
    }
  }


  const handleEdit = async() => {
    try{

        setVisiblePreference(true)
       
    }catch (error) {
        alert(JSON.stringify(error, null, 2))
    }
  }


  const viewPreference = async(email,name,dep,course) =>{
    setStudentEmail(email)
    setStudentName(name);
    setStudentDepartment(dep);
    setStudentCourse(course);
    try{
       
        
        const response = await fetch(`http://localhost:4000/preferences?userEmail=${email}`,{
            headers : {
                'Content-Type' : 'application/json',
                Authorization : `Bearer ${token}`
            },
        })
    

if(!response.ok) {
        throw new Error('Response was not ok');
}

const preferenceData = await response.json();
setPreference(preferenceData)
setVisible(true);
console.log(preferenceData);
console.log(visible);

}catch (error) {
console.log('Error fetching preferences:', error)
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
    axios
      .post(`http://localhost:4000/preferences`,  {...preferences, studentEmail} , {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        alert(data.message);
        window.location.href ="./viewstudents"
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

  const handleDeadline = () => {
    axios.post('http://localhost:4000/deadline', { deadline }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }).then(res => alert(res.data.message))
      .catch(e => alert(JSON.stringify(e)))
  }

const searchStudent = async ()=>{
  try {
    const response = await fetch(`http://localhost:4000/user/searchStudents?name=${searchContent}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if(!response.ok) {
      throw new Error('Response was not ok');
}

const studentsData = await response.json();
setStudents(studentsData);

}catch (error) {
console.log('Error fetching students:', error)
}
  
}
if(students.length === 0)
{
  return (
    <div>
       <h3 className="text-center">Allocation of Students to Groups</h3>
         <AdminNavPage></AdminNavPage> 
       <div className="card-body">
       <div>    
       <h5> Students List </h5>
       <div className='mb-3'><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)} ></input>
       <SearchIcon onClick={searchStudent}> Search</SearchIcon>
       </div>
       
 
        </div> 
    <h5 className="card-title">Search Results</h5>
    <p className="card-text">No Records found</p>
    

  </div>

      </div>)
  
}

 return (
    <div>
         <h3 className="text-center">Allocation of Students to Groups</h3>
         <AdminNavPage></AdminNavPage>       
       <div>   
       <h3 className="d-flex justify-content-center"> Student List </h3>
       {/* <div className="d-flex justify-content-end"> */}
        <div><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)} ></input>
       <SearchIcon onClick={searchStudent}> Search</SearchIcon>
       <div className="d-flex justify-content-end">
       <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleDeadline} >Set Deadline</Button>
        </div>
        <div><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
        </div>
        </div>
        
       </div>
       </div> 
       {/* </div> */}

        <table className='table table-striped table-hover'>
        <tbody>
            <tr>
                <th>
                    #
                </th>
                 <th>
                  Student Name
                </th> 
                <th>
                    Student Email
                </th>
                <th>
                    Department 
                </th>
                <th>
                    Course
                </th>
                <th>
                    Edit
                </th>
                <th style={{ textAlign: 'center' }}>
                    Student Preference
                </th>

            </tr>
            {
                students.map((student, index)=>(
                    <tr key={student.email}>
                        <td>
                            {index + 1}
                        </td>
                        <td>
                            {student.name}
                        </td>
                        <td>
                 
                            {student.email}
                       
                        </td>
                        <td>
                            {student.department}
                        </td>
                        <td>
                            {student.course}
                        </td>
                        
                        <td>
                        <BorderColorIcon  onClick={()=> handleShow(student.name,student.department,student.course ,student.email )}></BorderColorIcon>   
                        </td>   

                        <td style={{ textAlign: 'center' }}>
                        <ViewTimelineIcon onClick={() => viewPreference(student.email,student.name,student.department,student.course ,)} ></ViewTimelineIcon></td> 
                                     
                    </tr>
                ))
            }
        </tbody>
    </table>
  

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Students</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Student Name</Form.Label>
              <Form.Control as="textarea" value={studentName}   onChange={(e) => setStudentName(e.target.value)} rows={3} ></Form.Control>
              <Form.Label>Student Department</Form.Label>
              <Form.Control as="textarea" value={studentDepartment}   onChange={(e) => setStudentDepartment(e.target.value)} rows={3} />
            </Form.Group>
            <Form.Label>Student course</Form.Label>
              <Form.Control as="textarea" value={studentCourse}   onChange={(e) => setStudentCourse(e.target.value)} rows={3} ></Form.Control>

          </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='danger' type="button" onClick={handleDelete}>Delete</Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => updateStudents()}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={visible} onHide={() => setVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title> Preference</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <div><Form.Label>Student Name : {studentName}</Form.Label></div>
              <div><Form.Label>Student Department : {studentDepartment} </Form.Label></div>
              <div><Form.Label>Student course : {studentCourse} </Form.Label></div>
              <div> 
              <h5>Preferences : </h5>  {preference.length !==0 ? <div>    
       
          <ol>
            {preference.map((preference, index) => (
              <li key={index}>{preference.topic.title}</li>
            ))}
          </ol>    
        </div>   : "Not Set"}  
      </div>     
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='primary' type="button" onClick={handleEdit}>Edit</Button>
          <Button variant="secondary" onClick={handleClosePreference}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
    



      <Modal show={visiblePreference} onHide={() => setVisiblePreference(false)} style={{ maxWidth: '4000px' }} centered >
        <Modal.Header closeButton>
          <Modal.Title> Set Student preference</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              
      <div> 
         <div>    
        <h5>Preferences</h5>               
        </div>     
      </div>     
            </Form.Group>
            <div>
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
              Preferences
              </th>
          </tr>
          {topics.map((topic) => (
            <tr key={topic.id}>
              <td>
                {topic.id}
                </td>
              <td>
                {topic.title}
                </td>
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
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit} class="btn btn-success text-center" style = {{cursor : 'pointer'  }}>Submit</button>
    </div>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSetPreference}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    
    </div>

  )
}

export default ViewUsers

