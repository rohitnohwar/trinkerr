import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Header from "../Header.js"
import EnterNumber from "./EnterNumber.js";
import EnterOtp from "./EnterOtp.js";
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import "../Login/Login.css"

function Register() {
  const navigate=useNavigate();
  const [otpSent, setOtpSent]=useState(false)
  const [data, setData]=useState({name:"", number:""})
  const [otp, setOtp]=useState()
  const [message, setMessage]=useState("")

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

  async function handleClick(event){
    event.preventDefault();
    const newUser={
        name:data.name,
        number:data.number
    };

    await axios.post("/register", newUser
    ).then((response)=>{
        notify(response.data.message)
    });
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

        <div><Link to="/">Already registered? Login instead.</Link></div>
        <ToastContainer theme="colored"/>
        {data.name} {data.number}
    </div>
  );
}

export default Register;
