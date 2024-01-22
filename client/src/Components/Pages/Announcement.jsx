import React,{useEffect, useState} from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import AdminNavPage from "./AdminNavPage";
import SupervisorNavPage from "./SupervisorNavPage";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import StudentNavpage from "./StudentNavPage";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Card from 'react-bootstrap/Card';
import BorderColorIcon from '@mui/icons-material/BorderColor';


const AddAnnouncement= () =>{
    const [subject,setSubject]= useState('');
    const [details,setDetails] = useState('');
    const [announcmentId,setAnnouncmentId] = useState('');
    const [isError,setIsError] = useState('');
    const [show, setShow] = useState(false);
    const [token, setToken] = useState('');
    const navigate = useNavigate()
    const [announcements, setAnnouncements] = useState([]);
    const [visible,setVisible] = useState('')
    const [userData, setUserdata]=useState("");
    const [role, setRole]=useState(null);
    const [userEmail, setUserEmail]=useState("");

    useEffect(() => {        
        getAllAnnouncements();
        userDetails();
    },[token])

    const userDetails = async ()=> {
      try {
          setToken(localStorage.getItem('token'));
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
    const getAllAnnouncements = async () => {
        try{
            const response = await fetch('http://localhost:4000/announcement',{
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${token}`,
                },
            });

            if(!response.ok){
                throw new Error('Responce was not ok')
            }

            const announcementData = await response.json();
            setAnnouncements(announcementData);
            console.log(announcementData);
        }catch(error){
            console.error('Error fetching announcements:',error);
        }
    };

    const handleSubmit=(e)=>{
        try {
         e.preventDefault()
         if(!subject || !details){
            alert("Please provide data")
            return;
         }
         console.log(subject,details);
         console.log(token)
         axios.post(`http://localhost:4000/announcement`, { subject, details }, {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`
           }
         }).then((res)=>res.data )
         .then((data)=>{
           alert("Annnouncement added successfully.")
           handleClose();
           getAllAnnouncements();       
         console.log(data);
            
         }).catch(e => {setIsError(true); console.log(e)})
        }catch (error) {
             alert("Unauthorized: Please log in to access this resource.");
        } 
     }


     const updateAnnouncements = async (id) =>{
        try{
          const body = {subject: subject, details: details}
          console.log(token)
          const response = await axios.put(`http://localhost:4000/announcement/${id}` , {
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }, body
        });
  
        if (response.status === 200) {
            alert('Announcement updated successfully.');
            handleClose();
          
  
        }else{
          throw new Error('Error updating the Announcement.');
        }
        console.log(token)
       } catch(error){
          alert((error))
        }
      }


     const handleDelete = async() => {
        try{
            const response = await axios.delete(`http://localhost:4000/announcement/${announcmentId}`,
            {
                
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
            });
    
            if (response.status === 200) {
                alert('Announcement deleted successfully.');
                handleCloseEdit();
                getAllAnnouncements();
                
              } else {
                throw new Error('Error deleting the Announcement.');
              }
        }catch (error) {
            alert(JSON.stringify(error, null, 2))
        }
      }

     const handleClose = () => setShow(false);
     const handleCloseEdit = () => setVisible(false);
     const handleShow = (subject, details) => {
       setSubject(subject);
       setDetails(details);
       setShow(true);
     };

     const handleEdit = (subject, details, id) => {
        setSubject(subject);
        setDetails(details);
        setAnnouncmentId(id);
        console.log(subject, details, id);
        setVisible(true);
      };

   

return(
    <div>
        {userData.role === 'Admin' && (
        <Card className="mb-3">
        <Card.Body>
        <div className="d-flex justify-content-between align-items-center">       
        <Card.Title>Make Announcements</Card.Title>
        <AddBoxIcon onClick={()=>handleShow(subject,details)}></AddBoxIcon>      
        </div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Announcements</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Subject</Form.Label>
              <Form.Control as="textarea"   onChange={(e) => setSubject(e.target.value)} rows={3} ></Form.Control>
              <Form.Label>Details</Form.Label>
              <Form.Control as="textarea"   onChange={(e) => setDetails(e.target.value)} rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
      </Card.Body>
      </Card>
)}

<Card className="mb-3">
                <Card.Body>
                    <Card.Title>All Announcements</Card.Title>
                    <div>
                        {announcements.slice().reverse().map((announcement) => (
                            <Card key={announcement.id} className="mb-3">
                                <Card.Body>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                    <Card.Title>{announcement.subject}</Card.Title>
                                    <Card.Text>{announcement.details}</Card.Text>
                                    <Card.Subtitle className="text-muted">
                                        Date: {new Date(announcement.createdAt).toLocaleDateString()}
                                    </Card.Subtitle>
                                    </div>
                                    {userData.role === 'Admin' && (
                                    <BorderColorIcon  onClick={()=> handleEdit(announcement.subject,announcement.details, announcement.id)}></BorderColorIcon>   
                                    )}
                                    </div>                                   
                                    </Card.Body> 
                                </Card>
                            ))}
                        </div>
                        </Card.Body>
                    </Card>
    
    {userData.role === 'Admin' && (
        <Modal show={visible} onHide={()=> setVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Announcements</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Subject</Form.Label>
              <Form.Control as="textarea" value={subject}  onChange={(e) => setSubject(e.target.value)} rows={3} ></Form.Control>
              <Form.Label>Details</Form.Label>
              <Form.Control as="textarea" value={details}   onChange={(e) => setDetails(e.target.value)} rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' type="button" onClick={handleDelete}>Delete</Button>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={() => updateAnnouncements()}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
      )} 
        </div>
      )
    }
export default AddAnnouncement
