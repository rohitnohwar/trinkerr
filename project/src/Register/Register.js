import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Header from "../Header.js"
import EnterNumber from "./EnterNumber.js";
import EnterOtp from "./EnterOtp.js";
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import firebase from "../Firebase/Firebase.js"
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
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

  const onSignInSubmit=(event)=>{
    event.preventDefault()
    console.log("h")
    const phoneNumber = "+91"+data.number;
    const appVerifier = window.recaptchaVerifier;
    configureCaptcha()
    const auth = getAuth();
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          setOtpSent(true)
          // ...
        }).catch((error) => {
          // Error; SMS not sent
          // ...
        });
  }
  const auth=getAuth()

  const configureCaptcha=()=>{
    const auth = getAuth();
window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
  'size': 'invisible',
  'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    onSignInSubmit();
  }
}, auth);
}

const handleOtp=(event)=>{
  event.preventDefault()
  const code = otp;
  window.confirmationResult.confirm(code).then((result) => {
  // User signed in successfully.
  const user = result.user;
  const newUser={
    name:data.name,
    number:data.number
};

axios.post("/register", newUser
).then((response)=>{
    notify(response.data.message)
    navigate("/")
});
  // ...
}).catch((error) => {
  // User couldn't sign in (bad verification code?)
  // ...
});
}
  return (
    <div className="main-login">
        <Header/>
        
        <div className="login">
            {!otpSent?
                <EnterNumber data={data} onDataChange={onDataChange} handleClick={onSignInSubmit}/>

                :

                <EnterOtp otp={otp} onOtpChange={onOtpChange} handleClick={handleOtp}/>
            }
        </div>

        <div><Link to="/">Already registered? Login instead.</Link></div>
        <ToastContainer theme="colored"/>
        {data.name} {data.number}
    </div>
  );
}

export default Register;
