import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function EnterOtp(props) {

  return (
    <form method="POST">
        <div><input type="text" placeholder="Enter OTP" className="login-textfield" 
        value={props.otp} onChange={props.onOtpChange}></input></div>
        <div><button className="login-button" onClick={props.handleClick}>Login</button></div>
    </form>
  );
}

export default EnterOtp;
