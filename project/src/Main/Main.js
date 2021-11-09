import React, {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {FaArrowAltCircleLeft} from "react-icons/fa"
import {FaArrowAltCircleRight} from "react-icons/fa"
import img1 from "../Images/one-icon-3.png"
import img2 from "../Images/free-shirt-icon-9.png"
import img3 from "../Images/serial-number-icon-19.png"
import img4 from "../Images/serial-number-icon-18.png"
import img5 from "../Images/number-one-icon-17.png"
import Header from "../Header.js"
import UserInfo from "./UserInfo.js"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import "./Main.css"

function Main() {

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
  const [message, setmessage]=useState("")
  const [length, setLength]=useState()
  const [index, setIndex]=useState(0)
  const [userArr, setUserArr]=useState([])
  const [notifyCounter, setNotifyCounter]=useState(true)
  const [imgArr, setImgArr]=useState([
    {image:"One", source:img1}, {image:"Two", source:img2}, 
    {image:"Three", source:img3}, {image:"Four", source:img4}, {image:"Five", source:img5}
  ])

  const next = async() => {
      //clearInterval(timer);
      if(imgArr.length-1===index && notifyCounter===true){
        notify("You have rated all the images, thank you.")
        await setNotifyCounter(false)
      }
      else if(notifyCounter===true){
        setIndex(index+1)
      }
      //clearInterval(timer);
  }

  const previous = async() => {
    //clearInterval(timer)
    await notify(`Image ${imgArr[index].image} removed`)
    await setImgArr(imgArr.filter((val, ind)=>{return ind!==index}))
    await setIndex(index===imgArr.length-1?index-1:index)
    await setLength(imgArr.length)
    if(length===2){
      notify("You have rated all the images, thank you.")
    }
    //clearInterval(timer)
  }

  //setInterval(next, 5000)

  return (
    <div >
        <Header />

        <div className="main">
          <div className="user-info"><UserInfo /></div>
          <div className="img-container">
            {imgArr.length>0 && <FaArrowAltCircleLeft className="left-arrow" onClick={previous}/>}
            <img src={(imgArr.length>0 && index<=imgArr.length-1 && index>=0)?imgArr[index].source:""} alt="No image to show" className="main-img"></img>
            {imgArr.length>0 && <FaArrowAltCircleRight className="right-arrow" onClick={next}/>}
            {message}
          </div>
        </div>
        <ToastContainer theme="colored"/>
        {imgArr.map((value, index)=>{return<div>{index} {value.image}</div>})}
        <br></br>
        {index}
        {imgArr.length}
        
    </div>
  );
}

export default Main;
