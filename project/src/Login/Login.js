import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Header from "../Header.js"
import EnterNumber from "./EnterNumber.js";
import EnterOtp from "./EnterOtp.js";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import axios from "axios";
import firebase from "../Firebase/Firebase.js"
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
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

let temp1
const onSignInSubmit=(event)=>{
  event.preventDefault()
  console.log("h")
  const user={
    number:data.number
};


axios.post("/login", user
).then(async(response) => {
    if(response.data.auth){
      temp1="present"
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
      else {
        notify(response.data.message)
    }
}); 


}

const configureCaptcha=()=>{
  const auth = getAuth();
window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
'size': 'invisible',
'callback': (response) => {
  // reCAPTCHA solved, allow signInWithPhoneNumber.
  onSignInSubmit();
},
defaultCountry:"IN"
}, auth);
onSignInSubmit()
}

const handleOtp=(event)=>{
event.preventDefault()
const code = otp;
window.confirmationResult.confirm(code).then((result) => {
// User signed in successfully.
const user = result.user;
const newUser={
  number:data.number
};

axios.post("/login", newUser
).then(async(response)=>{
  await Cookies.set("trinkerrName", response.data.name);
  await Cookies.set("trinkerrNumber", response.data.number.toString());
  console.log(Cookies.get("trinkerrName"), Cookies.get("trinkerrNumber"))
  notify(response.data.message)
  navigate("/main")
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
                <form action="/entry" method="POST">
                  <div><input name="number" type="text" placeholder="Enter phone number" className="login-textfield"
                  value={data.number} onChange={onDataChange}></input></div>
                  <div><button type="submit" className="login-button" name="sendbutton" value="none" id="sign-in-button" onClick={onSignInSubmit}>Send OTP</button></div>
                </form>

                :

                <form method="POST">
                  <div><input type="text" placeholder="Enter OTP" className="login-textfield" 
                  value={otp} onChange={onOtpChange}></input></div>
                  <div><button className="login-button" onClick={(event)=>{handleOtp(event)}}>Login</button></div>
                </form>
             }
        </div>

        <div><Link to="/register">Not registered yet? Register instead.</Link></div>
        <ToastContainer theme="colored"/>

    </div>
  );
}

export default Login;
