import React, {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import Name from "../Images/Name.svg"
import PhoneNumber from "../Images/Phone Number.svg"
import Cookies from "js-cookie"
import "./Main.css"

function userInfo(props) {

  const handleLogout=(event)=>{
    event.preventDefault();
    Cookies.remove("trinkerrName");
    Cookies.remove("trinkerrNumber");
    props.setAuth("");
  }

  return (
    <div className="user-info">
        <div className="user-info-parameter"><img src={Name} className="info-img"></img> {Cookies.get("trinkerrName")}</div>
        <div className="user-info-parameter"><img src={PhoneNumber} className="info-img"></img> {Cookies.get("trinkerrNumber")}</div>
        <div className="logout-button-div"><button className="login-button" onClick={handleLogout}>Logout</button></div>
    </div>
  );
}

export default userInfo;
