import {BrowserRouter as Router, Route, Routes } from  'react-router-dom';
import Register from './Components/Pages/Register'
import Login from "./Components/Pages/Login"
import Supervisor from './Components/Pages/Supervisor';
import Admin from './Components/Pages/Admin';
import Student from './Components/Pages/Student';
import Welcome from './Components/Pages/Welcome';
import AddTopic from './Components/Pages/AddTopic';
import Logout from './Components/Pages/Logout';
import ViewTopic from './Components/Pages/ViewTopic';
import DeleteTopic from './Components/Pages/Deletetopic';
import UpdateTopic from './Components/Pages/UpdateTopic';
import ViewStudents from './Components/Pages/ViewStudents';
import ViewSupervisors from './Components/Pages/ViewSupervisors';
import StudentPreferences from './Components/Pages/StudentPreferences';
import Allocation from './Components/Pages/Allocation';
import ViewGroups from './Components/Pages/ViewGroups';
import ViewStudentGroups from './Components/Pages/ViewStudentGroups';
import ViewSupervisorGroups from './Components/Pages/ViewSupervisorGroups';
import Verify from './Components/Pages/Verify';
import AddUsers from './Components/Pages/AddUsers'
import ForgotPassword from './Components/Pages/ForgotPassword';
import ResetPassword from './Components/Pages/ResetPassword';



function App() {
  return(
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Welcome/>}/>
          <Route  path="/register" element={<Register/>}/>
          <Route  path="/login" element={<Login/>}/>
          <Route  path="/supervisor" element={<Supervisor/>}/>
          <Route  path="/admin" element={<Admin/>}/>
          <Route  path="/student" element={<Student/>}/>
          <Route  path="/addtopic" element={<AddTopic/>}/>
          <Route  path="/logout" element={<Logout/>}/>
          <Route  path="/viewtopic" element={<ViewTopic/>}/>
          <Route  path="/deletetopic" element={<DeleteTopic/>}/>
          <Route  path="/updatetopic" element={<UpdateTopic/>}/>
          <Route  path="/viewstudents" element={<ViewStudents/>}/>
          <Route  path="/viewsupervisors" element={<ViewSupervisors/>}/>
          <Route  path="/studentpreferences" element={<StudentPreferences/>}/>
          <Route  path="/viewstudentgroups" element={<ViewStudentGroups/>}/>
          <Route  path="/viewsupervisorgroups" element={<ViewSupervisorGroups/>}/>
          <Route  path="/allocate" element={<Allocation/>}/>
          <Route  path="/viewgroups" element={<ViewGroups/>}/>
          <Route path="/verify/:verificationToken/:verificationEmail" element={<Verify/>}/>
          <Route  path="/addusers" element={<AddUsers/>}/>
          <Route  path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/reset-password/:verificationToken/:verificationEmail" element={<ResetPassword/>}/>
        </Routes>
      </Router>
    </div>
   
  );
}
export default App;



