import React from 'react'
import { useEffect, useState } from 'react'
import axios from "axios";
import AdminNavPage from './AdminNavPage';
import Form from 'react-bootstrap/Form';
import { Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SearchIcon from '@mui/icons-material/Search';


const ViewSupervisors = () => {
    const [supervisors, setSupervisors] = useState([]);
    const [userData, setUserdata] = useState(false);
    const [role, setRole] = useState(false);
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [supervisorName, setSupervisorName] = useState("")
    const [supervisorDepartment, setSupervisorDepartment] = useState('')
    const [token, setToken] = useState('');
    const [searchContent, setSearchContent] = useState('')
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
      setToken(localStorage.getItem('token'));
      userDetails();
      fetchSupervisors();
      getDeadline();
    }, [token]);
    const fetchSupervisors = async () => {
        try{
            const response = await fetch('http://localhost:4000/viewSupervisors',{
                headers : {
                    'Content-Type' : 'application/json'
                },
            })
        
   
    if(!response.ok) {
            throw new Error('Response was not ok');
    }

    const supervisorsData = await response.json();
    setSupervisors(supervisorsData);
}catch (error) {
    console.log('Error fetching students:', error)
}
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


const getDeadline = () => {
  axios.get('http://localhost:4000/deadline', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }). then(res => res.data).then(data => setDeadline(new Date(data.deadline).toISOString().split("T")[0])).catch(e => console.log(e))
}


    const userDetails = async ()=> {
        try {
          const response = await fetch('http://localhost:4000/token/verify', {
            headers: {
              'Content-Type': 'application/json',
              Authorization : `Bearer ${token}`,
            },
            method: 'GET'
          });
    
          const data = await response.json();
          setUserdata(data);
          setRole(data.role);
        } catch (error) {
          console.error('Error fetching User Details :', error);
        }
    
      }

    const updateSupervisors = async () =>{
      try{
        const body = {name: supervisorName, email: email, department: supervisorDepartment}
        const response = await axios.put(`http://localhost:4000/user`, body , {
          headers : {
              'Content-Type' : 'application/json',
              'Authorization' : `Bearer ${token}`
          }
      });

      if (response.status === 200) {
          alert('Supervisors updated successfully.');
          handleClose();
          fetchSupervisors();

      }else{
        throw new Error('Error updating the Supervisors.');
      }
     } catch(error){
        alert((error))
      }
    }

  const handleClose = () => setShow(false);
  const handleShow = (name,dep, email) => {
    setSupervisorName(name);
    setSupervisorDepartment(dep);
    setShow(true);
    setEmail(email)
  };



  const handleDelete = async() => {
    try{
        const response = await axios.delete(`http://localhost:4000/deleteSupervisors`,
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
            fetchSupervisors();
          } else {
            throw new Error('Error deleting the Student.');
          }
    }catch (error) {
        alert(JSON.stringify(error, null, 2))
    }
  }




  const searchSupervisor = async ()=>{
    try {
      const response = await fetch(`http://localhost:4000/user/searchSupervisors?name=${searchContent}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if(!response.ok) {
        throw new Error('Response was not ok');
  }
  
  const supervisorData = await response.json();
setSupervisors(supervisorData);
  
  }catch (error) {
  console.log('Error fetching students:', error)
  }
    
  }
  if(supervisors.length === 0)
  {
    return (
      <div>
         <h3 className="text-center">Allocation of Students to Groups</h3>
           <AdminNavPage></AdminNavPage> 
         <div className="card-body">
         <div>    
         <h5> Supervisor List </h5>
         <div className='mb-3'><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)} ></input>
         <SearchIcon onClick={searchSupervisor}> Search</SearchIcon>
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
        <h5> Supervisors List </h5>
        <div><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)} ></input>
       <SearchIcon onClick={searchSupervisor}> Search</SearchIcon>
       </div>
       <div className="d-flex justify-content-end">
       <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleDeadline} >Set Deadline</Button>
        </div>
        <div><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
        </div>
        </div>
         
        <table className='table table-striped table-hover'>
        <tbody>
            <tr>
                 <th>
                  Supervisor Name
                </th>
                <th>
                Supervisor Email
                </th>
                <th>
                  Department
                </th>
                <th>
                  Edit 
                </th>

            </tr>
            {
                supervisors.map(supervisors =>(
                    <tr key={supervisors.email}>
                        <td>
                            {supervisors.name}
                        </td>
                        <td>
                            {supervisors.email}
                        </td>  
                        <td>
                            {supervisors.department}
                          </td> 
                          <td>
                        <BorderColorIcon  onClick={()=> handleShow(supervisors.name,supervisors.department, supervisors.email )}></BorderColorIcon>   
                        </td>                      
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
              <Form.Label>Supervisor Name</Form.Label>
              <Form.Control as="textarea" value={supervisorName}   onChange={(e) => setSupervisorName(e.target.value)} rows={3} ></Form.Control>
              <Form.Label>Supervisor Department</Form.Label>
              <Form.Control as="textarea" value={supervisorDepartment}   onChange={(e) => setSupervisorDepartment(e.target.value)} rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' type="button" onClick={handleDelete}>Delete</Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => updateSupervisors()}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default ViewSupervisors

