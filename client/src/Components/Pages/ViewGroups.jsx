import React, { useEffect, useState } from 'react'
import AdminNavPage from './AdminNavPage'
import { Container, Row, Card, Button } from 'react-bootstrap'
import axios from 'axios'


const GroupCard = ({id, students, topic, supervisor}) => {
    return (
        <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{topic}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Group {id}</Card.Subtitle>
        <Card.Text>
            <ul>
                {students.map(student => <li key={student.email} >{student.email}</li>)}
            </ul>
            <p>Supervisor : {supervisor}</p>
        </Card.Text>
      </Card.Body>
    </Card>
    )
}

const ViewGroups = () => {
    const [token, setToken] = useState();
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        setToken(localStorage.getItem("token"))
        fetchGroups()
    }, [token, groups])
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

    const notifyGroups = async() => {
        try{
            const response = await axios.post("http://localhost:4000/notify",{},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            alert(response.data.message)
        }
    catch(error){
        alert(JSON.stringify(error))
    }

}

    const handleDelete = async() => {
        try{
            const response = await axios.delete("http://localhost:4000/groups", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            alert("Groups deleted");
            setGroups([])
        } catch(error){
            alert(JSON.stringify(error))
        }
    }
  return (
    <div>
        <h3 className="text-center">View Groups</h3>
        <AdminNavPage />
        <Container>
            <Row>
                {
                    groups.length == 0 ? <h1>Groups not yet allocated</h1> : <><Button onClick={notifyGroups}>Notify Students and Supervisors</Button> <Button onClick={handleDelete} variant='danger'>Delete all groups</Button></> 
                    
                }
                {
                    groups.map(group => <GroupCard id={group.id} key={group.id} students={group.users} topic={group.topic.title} supervisor={group.topic.userEmail}/>)
                }
            </Row>
        </Container>
    </div>
  )
}


export default ViewGroups

