import React, { useEffect, useState } from 'react'
import AdminNavPage from './AdminNavPage'
import { Button, Container, Form, Row } from 'react-bootstrap'
import axios from 'axios';

const Allocation = () => {
    const [size, setSize] = useState(5);
    const [token, setToken] = useState();
    const [groups, setGroups] = useState([]);
    const [allocated, setAllocated] = useState(false);

    useEffect(() => {
        (async() => {
            setToken(localStorage.getItem("token"))
            await fetchGroups()
        })()
    }, [token])

    useEffect(() => {
        setAllocated(groups.length != 0)
    }, [groups, size])
    const fetchGroups = async() => {
        try{
            const response = await axios.get("http://localhost:4000/groups", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setGroups(response.data.groups)
        } catch(error){
            alert(error.response.data.error)
        }
    }

    const allocate = async () => {
        try{
            const response = await axios.post("http://localhost:4000/allocate", {groupSize: size}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            setAllocated(true)
        } catch(error){
            alert(error.response.data.error)
        }
    }
  return (
    <div>
        <h3 className="text-center">Allocation of Students to Groups</h3>
       <AdminNavPage />
       <h4>Allocation</h4>
       <Container flex >
        <Row>
        <Form.Group>
        <Form.Label>Group size</Form.Label>
        <Form.Control name="groupSize"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        type="number"
        min={2}
        max={10}>
        </Form.Control>
        </Form.Group>
        </Row>
        <Button disabled={allocated} type='button' onClick={allocate}>Allocate</Button>
        {allocated && <h4>Groups are allocated</h4>}   
       </Container>
    </div>
  )
}

export default Allocation