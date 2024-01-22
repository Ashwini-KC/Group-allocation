import React from 'react'
import { useEffect, useState } from 'react';
import StudentNavpage from './StudentNavPage';
import axios from "axios";
import Card from 'react-bootstrap/Card';
import { json } from 'react-router-dom';


const ViewStudentGroups = ({url}) =>{
    const [token,setToken] = useState(localStorage.getItem('token'));
    const [studentGroups, setStudentGroups] = useState([]);
    const [userData, setUserdata]=useState("");
    const [role, setRole]=useState(null);
    const [userEmail, setUserEmail]=useState("");
    
    useEffect(() => {
        userDetails();
        fetchStudentGroups();
    },[token]);


    const fetchStudentGroups = async () =>{
        try{

            const response = await axios.get('http://localhost:4000/groups/student',{
                headers : {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });

            if(response.status !== 200) {
                const responseData = await response.data

                console.error('Response data:', responseData);
                return;
            }
            const studentsData = await response.data
            setStudentGroups(studentsData.groups)
        }catch(error){
            alert(JSON.stringify.error)
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


    return(
        <div>
             <h3 className='text-center'>Allocation of Students to Groups</h3>
             <StudentNavpage></StudentNavpage>
             <h5>View Groups </h5>



             <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Groups</Card.Title>
                    <div>
                        {studentGroups && 
                            studentGroups.map(group => 
                            <Card key={group.id} className="mb-3">
                                <Card.Body>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                    <Card.Title>Group {group.id}</Card.Title>
                                    <Card.Text> Topic : {group.topic.title}</Card.Text>
                                    <p>Supervisor : {group.supervisor}</p>
                                    {group.students.map(student => 
                                    <Card.Subtitle className="text-muted">
                                        {student}
                                    </Card.Subtitle>)
                                    }
                                     
                                    </div>
                                    </div>                                   
                                    </Card.Body> 
                                </Card>
                            )}
                        </div>
                        </Card.Body>
                    </Card>

           
        </div>
    )


}

export default ViewStudentGroups