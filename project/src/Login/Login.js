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

const emergencyLogin=async()=>{
  await Cookies.set("trinkerrName", "Emergency");
  await Cookies.set("trinkerrNumber", "Emergency");
  navigate("/main");
}


const handleSendOtp = async (e) => {
  let temp
  
  e.preventDefault()

  const user={
    number:data.number
};

await axios.post("/login", user
).then(async(response) => {
    if(response.data.auth){
      temp="present"
    }
    else {
        notify(response.data.message)
    }
}); 
  
  if (temp === "present") {
      ConfigureCaptcha()
      const phoneNumber = "+91" + data.number
      console.log(phoneNumber)
      let appVerifier = window.recaptchaVerifier;
      firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
          .then((confirmationResult) => {
              window.confirmationResult = confirmationResult;
              setOtpSent(true)
 
          }).catch((error) => {
              //window.grecaptcha.reset(appVerifier)
              //window.grecaptcha.reset(window.recaptchaVerifier)
              alert("Limit of 5 uses per phone number per day exceeded")
          });
  }
  else {
    //notify("User doesn't exist")
  }
  // setIsEmail(true)
}


const handleOtp = async(e) => {
  e.preventDefault();
  console.log("inside handle_signup_otp")
  if (otp?.length == 6) {
      const code = otp.toString();
      console.log(code, "code")
      window.confirmationResult.confirm(code).then(async(result) => {
          const user = result.user;
          const userdata={
            number:data.number
        };
        
        await axios.post("/login", userdata
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

      }).catch((error) => {
          console.log(error, "error")
      });
  }
}



const ConfigureCaptcha = () => {
  console.log("yaha", data.number, typeof otp_num)
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    console.log("Recaptca varified")
      },
      defaultCountry: "IN"
  });
}
  return (
    <div className="main-login">
        <Header/>
        
        <div className="login">
            {!otpSent?
              <EnterNumber data={data} onDataChange={onDataChange} handleClick={handleSendOtp}/>

              :

              <EnterOtp otp={otp} onOtpChange={onOtpChange} handleClick={handleOtp}/>
             }
        </div>

        <div><Link to="/register">Not registered yet? Register instead.</Link></div>
        <div style={{width:"fit-content", marginTop:"10px"}} onClick={emergencyLogin}>Emergeny login (OTP limit per phone number per day is 5 in firebase)</div>
        <ToastContainer theme="colored"/>

    </div>
  );
}

export default Login;
