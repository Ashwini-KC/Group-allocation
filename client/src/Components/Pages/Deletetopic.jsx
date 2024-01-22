import React from 'react'
import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AdminNavPage from './AdminNavPage';
import SupervisorNavPage from './SupervisorNavPage';

import { Modal, Button } from "react-bootstrap";


const DeleteModal = ({toggleConfirm,topicId, confirm, setTopicId, deletetopic}) => {
  return <Modal show={confirm} onHide={toggleConfirm}>
          <Modal.Header closeButton onClick={(e) => toggleConfirm()}>

        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Are you sure you want to delete this topic?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={() => {toggleConfirm(); setTopicId(null)}} >Cancel</Button>
        <Button type="button" variant="danger" onClick={async() => { await deletetopic(topicId); setTopicId(null); toggleConfirm();}} >Delete</Button>
      </Modal.Footer>
  </Modal>
}

const Deletetopic = () => {
    const [topics, setTopics] = useState([]);
    const [isError, setIsError] = useState(false);
    const [userData, setUserdata] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [topicId, setTopicId] = useState();
    const [role, setRole] = useState(false);
    const [userEmail, setUserEmail]=useState("");
    const token = window.localStorage.getItem('token');
    
    const toggleConfirm = () => {
      setConfirm(!confirm)
    }
    useEffect(() => {
      userDetails();
    fetchTopics();
    }, []);
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://localhost:4000/topics', {
          headers: {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const topicsData = await response.json();
        setTopics(topicsData);
        console.log(topicsData)
      } catch (error) {
        console.error('Error fetching topics:', error);
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
  
        const userData = await response.json();
        setUserdata(userData);
        setRole(userData.role)
        setUserEmail(userData.email)
      } catch (error) {
        console.error('Error fetching User Details :', error);
      }
  
    }



    const deletetopic = async (id) => { 
      try {
        const response = await axios.delete(` http://localhost:4000/topics/${id}`,  {
        headers: {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${token}`
            }
     
       }).then((res)=>res.data )
       .then((data)=>{
           alert(data.message);
       }).catch(e => console.log(JSON.stringify(e, null, 2)))

      
       
       fetchTopics();
      }
      catch (error) {
       
        alert("Unauthorized: Please log in to access this resource.");

      } 
   }

   const deletemodal = (id) =>
   {
    
    setConfirm(true);
    setTopicId(id)
    console.log(confirm);
   }


  return (
    <div>
       <h3 className="text-center">Allocation of Students to Groups</h3>
      { role === "Admin" ? <AdminNavPage></AdminNavPage> : <SupervisorNavPage></SupervisorNavPage> }
    <h5> Delete Topics </h5>

    <table className='table table-striped table-hover'>
        <tbody>
            <tr>
                 <th>
                  Topic Code
                </th>
                <th>
                    Topic Title
                </th>
                <th>
                   Topic Decsription
                </th>
                <th>
                   Supervisor
                </th>
                <th>
                   Delete Topic
                </th>

            </tr>
            {
                topics.map(topic=>(
                    <tr key={topic.id}>
                        <td>
                            {topic.id}
                        </td>
                        <td>
                            {topic.title}
                        </td>
                        <td>
                            {topic.description}
                        </td>
                        <td>
                            {topic.userEmail}
                        </td>
                      <td>
                        {/* {role == "Admin" ? <DeleteIcon onClick={() => deletetopic(topic.id)}></DeleteIcon> : (role == "Supervisor" && userEmail == topic.userEmail) ? <DeleteIcon style = {{cursor : 'pointer' }} onClick = {() => {setConfirm(true); setTopicId(topic.id) ;  }}></DeleteIcon> : <DeleteIcon style = {{cursor : 'pointer', color : 'grey'}}></DeleteIcon>} */}
                        {role == "Admin" ? <DeleteIcon onClick={() => deletetopic(topic.id)}></DeleteIcon> : (role == "Supervisor" && userEmail == topic.userEmail) ? <DeleteIcon style = {{cursor : 'pointer' }} onClick={()=> deletemodal(topic.id)}></DeleteIcon> : <DeleteIcon style = {{cursor : 'pointer', color : 'grey'}}></DeleteIcon>}
                        
                        </td>
                    </tr>
                ))
            }
        </tbody>
    </table>
    {
        isError ? <div className="modal show"
        style={{ display: 'block', position: 'initial' }}>
            <Modal.Dialog>
            <Modal.Header closeButton onClick={(e) => setIsError(false)}>

          <Modal.Title>Error</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Unable to delete</p>
        </Modal.Body>
        </Modal.Dialog> </div>: <></>
    }
    {
      confirm ? <DeleteModal toggleConfirm={toggleConfirm} topicId={topicId} confirm={confirm} setTopicId={setTopicId} deletetopic={deletetopic} /> : <></>
    }
  </div>
);
}

export default Deletetopic