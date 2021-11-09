import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Header from "../Header.js"
import EnterNumber from "./EnterNumber.js";
import EnterOtp from "./EnterOtp.js";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import "./Login.css"

function Login() {

  const notify = (msg) =>
  toast.info(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
  });

  const navigate=useNavigate();
  const [otpSent, setOtpSent]=useState(false)

  return (
    <div className="main-login">
        <Header/>
        
        <div className="login">
            {!otpSent?
                <EnterNumber />

                :

                <EnterOtp />
            }
        </div>

        <div><Link to="/register">Not registered yet? Register instead.</Link></div>
        <ToastContainer theme="colored"/>

    </div>
  );
}

export default Login;
