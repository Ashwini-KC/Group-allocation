import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AdminNavPage from './AdminNavPage';
import SupervisorNavPage from './SupervisorNavPage';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useNavigate } from "react-router-dom";



const UpdateTopic = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState([]);
  const [isError, setIsError] = useState(false);
  const [show, setShow] = useState(false);
  const [topicId,setTopicId]=useState();
  const [topicTitle,setTopictitle]=useState("");
  const [topicDes,setTopicdes]=useState("");
  const [userData, setUserdata]=useState("");
  const [role, setRole]=useState(null);
  const [userEmail, setUserEmail]=useState("");

  

  const token = window.localStorage.getItem('token');
  // const navigate = useNavigate();

  // const [isSupervisor, setIsSupervisor] = useState(null);
  // const [error, setError] = useState(null);
  // useEffect(() => {
  //     axios.get("http://localhost:4000/token/verify", {headers: {
  //         "Authorization": `Bearer ${window.localStorage.getItem("token")}`
  //     }})
  //         .then(res => res.data)
  //             .then(data => {
  //               console.log(data.role != "Supervisor" || data.role != "Admin")
  //               if(data.role != "Supervisor" || data.role != "Admin"){
  //                 setIsSupervisor(true)
  //               } return data
  //             })
  //             .then(( data) => {
  //               if(!isSupervisor){
  //                 alert("Login as supervisor")
  //                 navigate("/login")
  //               } else{
  //                 userDetails();
  //               fetchTopics();
  //                 navigate(`/${data.role.toLowerCase()}`)
  //               }
  //             })
  //                 .catch(e => setError(e))
  // },[isSupervisor])

  useEffect(() => {
    
    userDetails();
    fetchTopics();

  }, []);


  //User Details Information.

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
       
      console.log(userData);
      console.log(userData.email);
      setUserEmail(userData.email)
    
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

  const updateTopic = async () => {
    try {
        const response = await axios.put(`http://localhost:4000/topics/${topicId}`, {
          title: topicTitle.trim(),
          description: topicDes.trim(),
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          alert('Topic updated successfully.');
          handleClose();
          fetchTopics();
        } else {
          throw new Error('Error updating the topic.');
        }
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = (id,title,des) => {
    setTopicId(id);
    setTopictitle(title);
    setTopicdes(des);
    setShow(true)
  };

  return (
    <div>
       <h3 className="text-center">Allocation of Students to Groups</h3>
      {role === "Admin" ? <AdminNavPage></AdminNavPage> :<SupervisorNavPage></SupervisorNavPage> }
      <h5>Edit Topics</h5>
       <table className='table table-striped table-hover'>
       
        <tbody>
          <tr>
            <th>Topic Code</th>
            <th>Topic Title</th>
            <th>Topic Description</th>
            <th>Supervisor</th>
            <th>Update Topic</th>

          </tr>
          {topics.map((topic) => (
            <tr key={topic.id}>
              <td>{topic.id}</td>
              <td>{topic.title}</td>
              <td>{topic.description}</td>
              <td> {topic.userEmail}</td>

              <td>
 {role == "Admin" ? <BorderColorIcon  onClick={()=> handleShow(topic.id,topic.title, topic.description )}></BorderColorIcon>  : (role =="Supervisor" && userEmail == topic.userEmail) ? <BorderColorIcon style = {{cursor:'pointer',}} onClick={()=> handleShow(topic.id,topic.title, topic.description )}  ></BorderColorIcon> : <BorderColorIcon  style = {{cursor:'pointer',color : 'grey'}} ></BorderColorIcon>}


              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Topic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Topic Name</Form.Label>
              <Form.Control as="textarea" value={topicTitle}   onChange={(e) => setTopictitle(e.target.value)} rows={3} ></Form.Control>
              <Form.Label>Topic Description</Form.Label>
              <Form.Control as="textarea" value={topicDes}   onChange={(e) => setTopicdes(e.target.value)} rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => updateTopic()}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    
    </div>
  );
};

export default UpdateTopic;


