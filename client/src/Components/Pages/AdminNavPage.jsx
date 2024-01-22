import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Logout from './Logout';

const AdminNavPage = () => {
  return (
   <nav className="navbar navbar-expand-lg navbar-light bg-light">
  
  <div className="collapse navbar-collapse" id="navbarNav">

    <ul className="navbar-nav">
    <li className="nav-item">
        <a className="nav-link" href="/admin">Home</a>
      
      </li>
     <li className="nav-item">
        <a className="nav-link" href="/viewtopic">View Topics</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/updatetopic">Update Topics</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/deletetopic">Delete Topics</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/viewstudents">View Students</a>
      </li> 
      <li className="nav-item">
        <a className="nav-link" href="/viewsupervisors">View Supervisors</a>
      </li>
     
      <li className="nav-item">
        <a className="nav-link" href="/allocate">Allocate Students</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/viewgroups">View Groups</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/addusers">Add User</a>
      </li>

    </ul>

  </div>
     
     <Logout></Logout>
     
</nav>
    
  )
  
}

export default AdminNavPage