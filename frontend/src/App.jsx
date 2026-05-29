import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import About from './components/About'
import Navbar from './components/Navbar'
import {Routes, Route, useLocation} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoutes'
import PasswordResetRequest from './components/PasswordResetRequest'
import PasswordReset from './components/PasswordReset'
import MemberSearch from './components/MemberSearch'
import MemberInfo from './components/MemberInfo'
import MemberList from './components/MemberList'
import AddMember from './components/AddMember'
import { Toaster } from 'react-hot-toast'

function App() {
  const location = useLocation()
  const noNavbar = location.pathname === "/register" || location.pathname === "/" || location.pathname.includes("password")

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      {
        noNavbar ?
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/request/password_reset" element={<PasswordResetRequest/>}/>
            <Route path="/password-reset/:token" element={<PasswordReset/>}/>
        </Routes>

        :

        <Navbar
        content={
          <Routes>
            <Route element={<ProtectedRoute/>}> 
                <Route path="/home" element={<Home/>}/>
                <Route path="/add-member" element={<AddMember/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/members" element={<MemberList/>}/>
                <Route path="/transaction/search" element={<MemberSearch/>}/>
                <Route path="/transaction/info" element={<MemberInfo/>}/>
            </Route>
          </Routes>

        }
      />
      }
    </div>
  )
}

export default App
