import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Header from "../Header.js"
import EnterNumber from "./EnterNumber.js";
import EnterOtp from "./EnterOtp.js";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import axios from "axios";
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
  const [data, setData]=useState({number:""})
  const [otp, setOtp]=useState()

  const onDataChange=(event)=>{
    const{name, value}=event.target;
    setData(prevValue=>{
        return{
            ...prevValue,
            [name]:value
        }
    })
  }

  const onOtpChange=(event)=>{
    const{name, value}=event.target;
    setOtp(value)
  }

  function handleClick(event){ 
    document.body.style.cursor='wait';
    event.preventDefault();
    const user={
        number:data.number
    };
    
    axios.post("/login", user
    ).then(async(response) => {
        if(response.data.auth){
          console.log(response.data)
            await Cookies.set("trinkerrName", response.data.name);
            await Cookies.set("trinkerrNumber", response.data.number.toString());
            console.log(Cookies.get("trinkerrName"), Cookies.get("trinkerrNumber"))
            navigate("/main");
        }
        else {
            notify(response.data.message)
        }
    }); 
    document.body.style.cursor='default';
}

  return (
    <div className="main-login">
        <Header/>
        
        <div className="login">
            {!otpSent?
                <EnterNumber data={data} onDataChange={onDataChange} handleClick={handleClick}/>

                :

                <EnterOtp otp={otp} onOtpChange={onOtpChange}/>
            }
        </div>

        <div><Link to="/register">Not registered yet? Register instead.</Link></div>
        <ToastContainer theme="colored"/>

    </div>
  );
}

export default Login;
