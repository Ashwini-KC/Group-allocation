import React,{useState} from "react"
import axios from "axios";
import Button  from "react-bootstrap/Button";
import StudentNavpage from "./StudentNavPage";
import Announcement from "./Announcement";

const Student = (props) => {
    const [name, setName]=useState('');
    const [topic, setTopic]=useState('');
    const [description,setDescription]=useState('');

    const handleSubmit=(e)=>{
        e.preventDeafult()
        axios.post('http://localhost:4000/student',{name,topic,description},{
            headers:{
                "Content-Type":"application/json"
            }
        }).then(res=>res.data).then(data=>console.log(data).catch(e=>console.log(e)))
    }
  return (
   <div>
    <h3 className="text-center">Allocation of Students to Groups</h3>
    <h4>Student</h4>
   <StudentNavpage></StudentNavpage>
    <div className="card">
    <div className="card-header">
    Student Homepage
    </div>
  <div className="card-body">
    <h5 className="card-title">Notification</h5>
   <Announcement></Announcement>

  </div>
</div>
    
</div>
  )
}

export default Student