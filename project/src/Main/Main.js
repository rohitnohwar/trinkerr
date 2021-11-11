import React, {useEffect, useState} from "react"
import {Link, useNavigate,Navigate} from "react-router-dom"
import {FaArrowAltCircleLeft, FaCheck, FaRemoveFormat} from "react-icons/fa"
import {FaArrowAltCircleRight} from "react-icons/fa"
import img1 from "../Images/one-icon-3.png"
import img2 from "../Images/free-shirt-icon-9.png"
import img3 from "../Images/serial-number-icon-19.png"
import img4 from "../Images/serial-number-icon-18.png"
import img5 from "../Images/number-one-icon-17.png"
import Header from "../Header.js"
import UserInfo from "./UserInfo.js"
import Modal from "./Modal.js"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie"
import axios from "axios"
import "./Main.css"

function Main() {
  const getPosts=async()=>{
    let arr=[]

    const user={
      name:Cookies.get("trinkerrName"),
      number:parseInt(Cookies.get("trinkerrNumber"))
    }

    await axios.get("/posts", {params:user}).then(async(response)=>{
      const array=response.data.posts
      console.log(response.data.posts)
      for(let i=0; i<response.data.posts.length; i++){
        arr.push(img[response.data.posts[i]])
      }
      await setIndex(response.data.index)
    })

    setImgArr(arr)
  }

  useEffect(()=>{
    getPosts()
  },[])

  const [img, setImg]=useState([    {ind:0, image:"One", source:img1}, {ind:1, image:"Two", source:img2}, 
  {ind:2, image:"Three", source:img3}, {ind:3, image:"Four", source:img4}, {ind:4, image:"Five", source:img5}])


  const [auth, setAuth]=useState(Cookies.get("trinkerrNumber"))


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
  const [index, setIndex]=useState(0)
  const [allRated, setAllRated]=useState(false)
  const [open, setOpen]=useState(false)
  const [imgArr, setImgArr]=useState([])
  const [deleteTrigger, setDeleteTrigger]=useState(true)
  const [deletePermit, setDeletePermit]=useState(false)
  const [nextTrigger, setNextTrigger]=useState(true)
  const [nextPermit, setNextPermit]=useState(false)


 


    /*let timer=setInterval(()=>{
      if(imgArr.length>0 && index!==imgArr.length-1){
        setIndex((imgArr.length===0 || index===imgArr.length-1)?index:index+1)
        clearInterval(timer)
      }
      else if(notifyBool===true) {
        notify("You have rated all the images, thank you.")
        clearInterval(timer)
      }
    },5000)*/

  const remove=async()=>{
    /*await setIndex((index===imgArr.length-1)?index-1:index)
    let imgA=[]
    for(let i=0; i<imgArr.length; i++){
      if(index!==i){
        imgA.push(imgArr[i])
      }
    }*/
    const data={
      number:parseInt(Cookies.get("trinkerrNumber")),
      posts:imgArr
    }
    await axios.post("/delete", data).then((response)=>{
      getPosts()
    })
  }

  const nextIndex=async()=>{
    /*await setIndex((index===imgArr.length-1)?index-1:index)
    let imgA=[]
    for(let i=0; i<imgArr.length; i++){
      if(index!==i){
        imgA.push(imgArr[i])
      }
    }*/
    const data={
      number:parseInt(Cookies.get("trinkerrNumber")),
      index:index
    }
    await axios.post("/next", data)
  }

  const next = async() => {
    await setNextPermit(true)
    if(allRated===false){
      if(imgArr.length-1===index ){
        setAllRated(true)
        setOpen(true)
      }
      setIndex(index===imgArr.length-1?index:index+1)
    }
    else if(allRated===true) {
      setOpen(true)
    }
  }

  const previous = async() => {
    //await clearInterval(timer)
    await setDeletePermit(true)
    if(allRated===false){
      if(imgArr.length-1===index){
        setAllRated(true)
        setOpen(true)
      }
        //await remove()
        setImgArr(imgArr.filter((value,ind)=>{return ind!==index}))
        setIndex((index===imgArr.length-1)?index-1:index)
        setDeleteTrigger(deleteTrigger===true?false:true)
    }
    else if(allRated===true){
      setOpen(true)
    }
  }

  useEffect(async()=>{
    if(deletePermit===true){
      await remove()
    }
  },[deleteTrigger])

  useEffect(async()=>{
    if(nextPermit===true){
      await nextIndex()
    }
  },[nextTrigger])
  
  /*let timer=setInterval(async()=>{
    await clearInterval(timer)
    if(allRated===false){
      await next()
    }
    await clearInterval(timer)
  },5000)*/

  const reset=async()=>{
    const data={
      number:Cookies.get("trinkerrNumber")
    }
    await axios.post("/reset",data).then(async()=>{
      await getPosts()
      setIndex(0)
    })
  }


  

if(auth){
  return (
    
    <div >
        <Header />

        <div className="main">
          <div className="user-info"><UserInfo navigate={navigate} setAuth={setAuth}/></div>
          <div className="img-container">
            {imgArr.length>-1 && <FaArrowAltCircleLeft className="left-arrow" onClick={previous}/>}
            <img src={(imgArr.length>0 && index<=imgArr.length-1 && index>=0)?imgArr[index]?.source:""} alt="No image left to rate" className="main-img"></img>
            {imgArr.length>-1 && <FaArrowAltCircleRight className="right-arrow" onClick={next}/>}
          </div>
        </div>
        <ToastContainer theme="colored"/>
        <Modal open={open} setOpen={setOpen}/>
        {imgArr?.map((value, index)=>{return<div>{index} {value?.image}</div>})}
        <br></br>
        {index}
        <br></br>
        {imgArr.length}
        <div className="logout-button-div"><button className="login-button" onClick={reset}>Reset images</button></div>
    </div>
  );
}
else {
  return <Navigate to="/" />
}
  }


export default Main;
