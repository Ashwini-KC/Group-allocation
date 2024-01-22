import React,{useEffect, useState} from "react"
import axios from "axios";
import { Modal } from "react-bootstrap";
import SupervisorNavPage from "./SupervisorNavPage";
import { useNavigate } from "react-router-dom";

const AddTopic=()=>{
    const [title,setTitle]= useState('');
  const [description,setDescription]= useState('');
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  
  useEffect(() => {
  }, [isError])

  const handleSubmit=(e)=>{
   try {
    e.preventDefault()
    const token=window.localStorage.getItem("token");
    // console.log(title,description, token);
    
    axios.post(`http://localhost:4000/topics`, { title, description }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    // }).then(res => res.data ).then(data => console.log(data.role, data.token)).catch(e => console.log(e) )
    }).then((res)=>res.data )
    .then((data)=>{
      alert("Topic added successfully.")
      navigate("/viewtopic")
        // console.log(data);
    }).catch(e => {
      setError(e.response.data.error)
      setIsError(true)
    
    })
        
    
   }//check for negative scenario--- not complete 
   catch (error) {
   
        alert("Unauthorized: Please log in to access this resource.");
     
    
   } 
}

  return (
    <div>
    
        <h3 className="text-center">Allocation of Students to Groups</h3>
        <SupervisorNavPage></SupervisorNavPage>
        <div class="card">
  <h5 class="card-header">Upload Topic</h5>
  <div class="card-body">
    <form onSubmit={handleSubmit}>
        <div className="input-group">
  <div className="input-group-prepend form-floating">
    <span >Title</span>
  
  
  <textarea className="form-control form"  onChange={(e) => setTitle(e.target.value)}   aria-label="With textarea"></textarea>
  </div>
  
</div>
  <div className="input-group">
  <div className="input-group-prepend form-floating">
    <span >Description</span>
  
  <textarea className="form-control " onChange={(e) => setDescription(e.target.value)}  aria-label="With textarea"></textarea>

  </div>
  
</div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
</div>
</div>
    {
        isError ? <div className="modal show"
        style={{ display: 'block', position: 'initial' }}>
            <Modal.Dialog>
            <Modal.Header closeButton onClick={(e) => {setIsError(false); setError("")}}>

          <Modal.Title>Error</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>{error}</p>
        </Modal.Body>
        </Modal.Dialog> </div>: <></>
    }
    </div>
  )
}

export default AddTopic