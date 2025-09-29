const express = require('express')
const { register, login, getUser, logout } = require('../controllers/authController')
const verifyToken = require('../middlewares/verifyToken')
const authRouter = express.Router()

// Authentication routes
authRouter.post("/register",register)                    // User registration
authRouter.post("/login",login)                         // User login
authRouter.get("/user",verifyToken,getUser)             // Get user profile (protected)
authRouter.get("/logout",logout)                        // User logout

module.exports = authRouter 