import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function EnterNumber() {

  return (
    <form method="POST">
        <div><input type="text" placeholder="Enter phone number" className="login-textfield"></input></div>
        <div><button className="login-button">Send OTP</button></div>
    </form>
  );
}

export default EnterNumber;
