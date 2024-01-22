import React from 'react'
import { useEffect, useState } from 'react'
import StudentNavpage from './StudentNavPage';
import AdminNavPage from './AdminNavPage';
import SupervisorNavPage from './SupervisorNavPage';
import SearchIcon from '@mui/icons-material/Search';



const ViewTopic = () => {
    const [topics, setTopics] = useState([]);
    const token = window.localStorage.getItem('token');
    const [userData, setUserdata] = useState(false);
    const [role, setRole] = useState(false);
    const [searchContent, setSearchContent] = useState('')
  
    useEffect(() => {
       
    fetchTopics();
    userDetails();
    }, []);
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://localhost:4000/topics', {
          headers: {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Response was not ok');
        }

        const topicsData = await response.json();
        setTopics(topicsData);
        console.log(topicsData)
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };


    const userDetails = async ()=> {
      try {
        const response = await fetch('http://localhost:4000/token/verify', {
          headers: {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${token}`,
          },
        });
  
        const userData = await response.json();
        setUserdata(userData);
        setRole(userData.role)
      } catch (error) {
        console.error('Error fetching User Details :', error);
      }
  
    }

    const searchTopics = async ()=>{
      try {
        const response = await fetch(`http://localhost:4000/topics/searchTopics?title=${searchContent}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
    
        if(!response.ok) {
          throw new Error('Response was not ok');
    }
    
    const topicsData = await response.json();
    setTopics(topicsData);
    
    }catch (error) {
    console.log('Error fetching topics:', error)
    }
      
    }
    if(topics.length === 0)
    {
      return (
        <div>
           <h3 className="text-center">Allocation of Students to Groups</h3>
           <div className="card-body">
           <div>   
           {role === "Admin" ? <AdminNavPage></AdminNavPage> : role === "Supervisor" ? <SupervisorNavPage> </SupervisorNavPage>  : <StudentNavpage></StudentNavpage> } 
           <h5>  View Topics </h5>
           <div className='mb-3'><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)} ></input>
           <SearchIcon onClick={searchTopics}> Search</SearchIcon>
           </div>   
            </div> 
        <h5 className="card-title">Search Results</h5>
        <p className="card-text">No Records found</p>
        
      </div>
      </div>
          )
      
    }

  return (
    <div>
      <h3 className='text-center'>Allocation of Students to Groups</h3>
      {role === "Admin" ? <AdminNavPage></AdminNavPage> : role === "Supervisor" ? <SupervisorNavPage> </SupervisorNavPage>  : <StudentNavpage></StudentNavpage> }
    <h5>View Topics </h5>
    <div><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)} ></input>
    <SearchIcon onClick={searchTopics}> Search</SearchIcon>
    </div>
    <table className='table table-striped table-hover'>
        <tbody>
            <tr>
                 <th>
                  Topic Code
                </th>
                <th>
                    Topic Title
                </th>
                <th>
                   Topic Decsription
                </th>
                <th>
                   Supervisor Email
                </th>

            </tr>
            {
                topics.map(topic=>(
                    <tr key={topic.id}>
                        <td>
                            {topic.id}
                        </td>
                        <td>
                            {topic.title}
                        </td>
                        <td>
                            {topic.description}
                        </td>
                        <td>
                            {topic.userEmail}
                        </td>
                     
                      
                    </tr>
                ))
            }
        </tbody>
    </table>
  </div>
);
}


export default ViewTopic