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
      if(response.data.posts.length-1===response.data.index){
        setAllRated(true)
      }
      const array=response.data.posts
      console.log(response.data.posts)
      for(let i=0; i<response.data.posts.length; i++){
        arr.push(img[response.data.posts[i]])
      }
      await setIndex(response.data.index)
      if(response.data.posts?.length-1===response.data.index){
        //setAllRated(true)
      }
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
  const [time, setTime]=useState(5)

  const remove=async()=>{
    const data={
      number:parseInt(Cookies.get("trinkerrNumber")),
      posts:imgArr,
      index:index
    }
    await axios.post("/delete", data).then((response)=>{

    })
  }

  const nextIndex=async()=>{
    const data={
      number:parseInt(Cookies.get("trinkerrNumber")),
      index:index
    }
    await axios.post("/next", data)
  }

  const next = async() => {
    setNextPermit(true)
    if(imgArr.length>0 && allRated===false){
      setIndex(index===imgArr.length-1?index:index+1)
      if(imgArr.length-1===index){
        setAllRated(true)
        setOpen(true)
      }
    }
    else {
      setOpen(true)
    }
    setNextTrigger(nextTrigger===true?false:true)
  }

  const previous = async() => {
    setDeletePermit(true)
    if(allRated===false && imgArr.length>0){
      await setImgArr(imgArr.filter((val, ind)=>{
        return ind!==index
      }))
      await notify(`${imgArr[index].image} removed`)
      setIndex(imgArr.length-1===index?index-1:index)
      if(imgArr.length-1===index){
        setAllRated(true)
        setOpen(true)
      }
    }
    else {
      setOpen(true)
    }
    setDeleteTrigger(deleteTrigger===true?false:true)
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
  

  const reset=async()=>{
    const data={
      number:Cookies.get("trinkerrNumber")
    }
    await axios.post("/reset",data).then(async()=>{
      await getPosts()
      setIndex(0)
      setAllRated(false)
    })
  }




  useEffect(() => {
    let interval = null;
    if (time>0) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else {
      setTime(5);
      if(allRated===false && imgArr.length-1>=index){
        next()
        if(index===imgArr.length-1){
          setAllRated(true)
        }
      }
    }
    return () => clearInterval(interval);
  }, [time]);

  useEffect(()=>{
    setTime(5)
  },[nextTrigger, deleteTrigger])
  

if(auth){
  return (
    
    <div >
        <Header />

        <div className="main">
          <UserInfo navigate={navigate} setAuth={setAuth}/>
          <div className="img-container">
            {imgArr.length>-1 && <FaArrowAltCircleLeft className="left-arrow" onClick={previous}/>}
            <img src={(imgArr.length>0 && index<=imgArr.length-1 && index>=0)?imgArr[index]?.source:""} alt="No image left to rate" className="main-img"></img>
            {imgArr.length>-1 && <FaArrowAltCircleRight className="right-arrow" onClick={next}/>}
          </div>
        </div>
        <ToastContainer theme="colored"/>
        <Modal open={open} setOpen={setOpen}/>
        {/*{imgArr?.map((value, index)=>{return<div>{index} {value?.image}</div>})}
        <br></br>
        {index}
        <br></br>
        {imgArr.length}*/}

        <div className="logout-button-div"><button className="login-button reset-button" onClick={reset}>Reset images</button></div>
    </div>
  );
}
else {
  return <Navigate to="/" />
}
  }


export default Main;
