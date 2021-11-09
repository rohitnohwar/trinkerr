import React, {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import Name from "../Images/Name.svg"
import PhoneNumber from "../Images/Phone Number.svg"
import "./Main.css"

function userInfo() {


  return (
    <div>
        <div className="user-info-parameter"><img src={Name}></img> {}</div>
        <div className="user-info-parameter"><img src={PhoneNumber}></img> {}</div>
    </div>
  );
}

export default userInfo;
