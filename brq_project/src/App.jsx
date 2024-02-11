import { useState } from 'react'
import './App.css'
import AdminDashBoard from './Pages/AdminDashBoard'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'; 
import NavBar from './Components/Navbar/NavBar';
import StudentDashBoard from './Pages/StudentDashBoard';
import AdminLoginPage from './Pages/AdminLoginPage';
import StudentLoginPage from './Pages/StudentLoginPage';


function App() {

  return (
  
    <Router>
      <NavBar/>
      <Routes>
      <Route path="/" element={<Navigate to="/studentLogin" />} />
      <Route path="/studentLogin" element={<StudentLoginPage/>} />
      <Route path="/adminLogin" element={<AdminLoginPage/>} />
      <Route path="/adminDashboard" element={<AdminDashBoard/>} />
      <Route path="/studentDashboard/:username" element={<StudentDashBoard/>} />
      </Routes>
    </Router>
    
  )
}

export default App
