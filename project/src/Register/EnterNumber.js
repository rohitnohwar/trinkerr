import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function EnterNumber(props) {

  return (
    <form method="POST">
        <div><input name="name" type="text" placeholder="Enter name" className="login-textfield" 
        value={props.data.name} onChange={props.onDataChange}></input></div>

        <div><input name="number" type="text" placeholder="Enter phone number" minLength="0" maxLength="10" steps="1"
        className="login-textfield" value={props.data.number} onChange={props.onDataChange}></input></div>
        
        <div><button className="login-button" id="sign-in-button" onClick={props.handleClick}>Send OTP</button></div>
    </form>
  );
}

export default EnterNumber;
