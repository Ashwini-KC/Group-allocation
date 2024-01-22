import React,{ useEffect, useState} from "react"
import axios from "axios";
import Button  from "react-bootstrap/Button";
import SupervisorNavPage from "./SupervisorNavPage";
import useVerify from "../../hooks/useVerify";
import { useNavigate } from "react-router-dom";
import Announcement from "./Announcement";




const Supervisor = (props) => {
    const [name, setName]=useState('');
    const [topic, setTopic]=useState('');
    const [description,setDescription]=useState('');
    const navigate = useNavigate();

    const [isSupervisor, setIsSupervisor] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        axios.get("http://localhost:4000/token/verify", {headers: {
            "Authorization": `Bearer ${window.localStorage.getItem("token")}`
        }})
            .then(res => res.data)
                .then(data => {
                  setIsSupervisor(data.role != "Supervisor")
                  return data.role
                }).then((role) => isSupervisor ? null : navigate(`/${role.toLowerCase()}`))
                    .catch(e => setError(e))
    },[isSupervisor])
    const handleSubmit=(e)=>{
        e.preventDeafult()
        axios.post('http://localhost:4000/supervisor',{name,topic,description},{
            headers:{
                "Content-Type":"application/json"
            }
        }).then(res=>res.data).then(data=>console.log(data).catch(e=>console.log(e)))
    }
  return (
   <div>
    <h3 className="text-center">Allocation of Students to Groups</h3>
    <SupervisorNavPage></SupervisorNavPage>
    <div className="card">
    <div className="card-header">
    Supervisor Homepage
    </div>
  <div className="card-body">
    <h5 className="card-title">Notification</h5>
   <Announcement></Announcement>
    

  </div>
</div>

    
   
   </div>
  )
}

export default Supervisor