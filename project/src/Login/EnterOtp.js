import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function EnterOtp() {

  return (
    <form method="POST">
        <div><input type="text" placeholder="Enter OTP" className="login-textfield"></input></div>
        <div><button className="login-button">Login</button></div>
    </form>
  );
}

export default EnterOtp;
