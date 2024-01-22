import React from "react"

import {WelcomePage} from "./WelcomePage.css"


const Welcome= (props)=>{
  const register=()=>{
    window.location.href="./register"
  }
  const login=()=>{
    window.location.href="./login"
  }

  return (
    <div className="welcome-page">
      <h1>Welcome to Personal and Group Skills Module</h1>
      <div className="buttons-container">
        <button className="btn btn-register" onClick={register}>Register</button>
        <button className="btn btn-login" onClick={login}>Login</button>
      </div>
    </div>
  );
};

    
export default Welcome






