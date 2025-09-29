import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Page components
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'
import Cancel from './pages/Cancel'
import Success from './pages/Success'
import DesignClothing from './pages/DesignClothing'

// Reusable components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// External libraries
import { Toaster } from "react-hot-toast" // Toast notifications

// Redux state management
import { useDispatch } from "react-redux"
import { setUser } from "./app/slices/authSlice"
import { setCart } from './app/slices/cartSlice'

// Helper functions
import getUserFromServer from './helpers/getUserFromServer'

import "./App.css"

const App = () => {
  const dispatch = useDispatch()
  
  // State for dark/light theme toggle
  const [isDarkMode,setIsDarkMode] = useState(false)
  
  // Function to fetch user data and populate Redux store
  const getUser = () => {
    getUserFromServer().then((data) => {
      if (data.success) {
        dispatch(setUser(data.user))     // Set user info in auth slice
        dispatch(setCart(data.user.cart)) // Set cart items in cart slice
      }
    })
  }
  
  // Fetch user data on app initialization
  useEffect(() => {
    getUser()
  }, [])

  return (
   // Apply dark/light theme class to entire app
   <div className={isDarkMode ? 'dark':'light'}>
     <BrowserRouter>
      {/* Global toast notifications */}
      <Toaster />
      
      {/* Navigation bar with theme toggle */}
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
      
      {/* App routing configuration */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        {/* Pass getUser function to refresh user data after login/payment */}
        <Route path="/login" element={<Login getUser={getUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success getUser={getUser}/>} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/design" element={<DesignClothing />} />
        {/* Catch-all route for 404 pages */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
      
      {/* Footer component */}
      <Footer />
    </BrowserRouter>
   </div>
  )
}

export default App
