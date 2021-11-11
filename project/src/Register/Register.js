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

 
const handleSendOtp = async (e) => {
  let temp
  e.preventDefault()

  const user={
    number:data.number
};

  
    if(data.number.length===10 && data.name){
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
      notify("Please enter a 10 digit number and fill all details compulsorily")
    }
  // setIsEmail(true)
}


const handleOtp = (e) => {
  e.preventDefault();
  console.log("inside handle_signup_otp")
  if (otp?.length == 6) {
      const code = otp.toString();
      console.log(code, "code")
      window.confirmationResult.confirm(code).then(async(result) => {
          const user = result.user;
          const userdata={
            name:data.name,
            number:data.number
        };
        
        await axios.post("/register", userdata
        ).then((response)=>{
            notify(response.data.message)
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

        <div><Link to="/">Already registered? Login instead.</Link></div>
        <ToastContainer theme="colored"/>
    </div>
  );
}

export default Register;
