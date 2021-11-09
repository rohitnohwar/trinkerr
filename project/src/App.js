import React from 'react';
import Login from "./Login/Login.js";
import Register from "./Register/Register.js";
import Main from "./Main/Main.js";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App(){ 

  return <Router>
  <div>
  <Routes>
    <Route path="/" exact element={<Login />} />
    <Route path="/register" exact element={<Register />} />
    <Route path="/main" exact element={<Main />} />
  </Routes>
  </div>
  </Router>
}

export default App;

