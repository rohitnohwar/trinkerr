import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function EnterNumber(props) {

  return (
    <form method="POST">
        <div><input name="number" type="text" placeholder="Enter phone number" className="login-textfield"
        value={props.data.number} onChange={props.onDataChange}></input></div>
        <div><button className="login-button" onClick={props.handleClick}>Send OTP</button></div>
    </form>
  );
}

export default EnterNumber;
