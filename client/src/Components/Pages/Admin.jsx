import React,{useState} from "react"
import axios from "axios";
import Button  from "react-bootstrap/Button";
import AdminNavPage from "./AdminNavPage";
import Announcement from "./Announcement";
const Admin = (props) => {
    const [name, setName]=useState('');
    const [topic, setTopic]=useState('');
    const [description,setDescription]=useState('');
   
    const handleSubmit=(e)=>{
        e.preventDeafult()
        axios.post('http://localhost:4000/admin',{name,topic,description},{
            headers:{
                "Content-Type" : "application/json"
            }
        }).then(res=>res.data).then(data=>console.log(data).catch(e=>console.log(e)))
    }
  return (
  <div>
    <h3 className="text-center">Allocation of Students to Groups</h3>
    <h3>Admin</h3>
    <AdminNavPage></AdminNavPage>
    <div>
    
  
    <div className="card">
    <div className="card-header">
    Admin Homepage
    </div>
  <div className="card-body">
    <h2 className="card-title">Announcements</h2>
   
    <Announcement></Announcement>
    

  </div>
</div>
    
</div>
    
    </div>
  )
}

export default Admin