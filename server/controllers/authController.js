const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// User registration handler
const register = async(req,res) =>{
    try{
        const {name,email,password} = req.body;

        // Validate required fields
        if(!name || !email || !password){
            return res.status(400).json({
                success:false, 
                message:"All fields are required."
            })
        }
        
        // Check if user already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                success:false,
                message:"Email already exist."
            })
        }

        // Hash password for security
        const hashedPassword = await bcrypt.hash(password,10)

        // Create new user with hashed password
        const newUser = new User({
            name,
            email,
            password:hashedPassword
        })

        await newUser.save()

        res.status(201).json({
            success:true,
            message:"Account Created."
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// User login handler
const login = async(req,res) =>{
    try{
        const {email,password} = req.body;

        // Validate required fields
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        
        // Find user by email
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }

        // Compare provided password with hashed password
        const comparePassword = await bcrypt.compare(password,user.password)
        if(!comparePassword){
            return res.status(400).json({
                success:false,
                message:"Wrong email or password."
            })
        }
        
        // Generate JWT token with 1 hour expiration
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'})
        
        // Set secure HTTP-only cookie with token
        res.cookie('token',token,{
            httpOnly:true,    // Prevents XSS attacks
            secure:true,      // HTTPS only
            sameSite:'none',  // Allow cross-site requests
            expires:new Date(Date.now()+3600000) // 1 hour expiration
        })
       
        res.status(200).json({
            success:true,
            message:"Login Successfull."
        })


    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// User logout handler - clears authentication cookie
const logout = async(req,res) =>{
    try{
        // Clear the token cookie by setting it to expire immediately
        res.clearCookie('token',{
            httpOnly:true,
            secure:true,
            sameSite:'none',
            expires:new Date(Date.now())
        })

        res.status(200).json({
            success:true,
            message:"Logout Successfull."
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// Get authenticated user's profile data (excluding password)
const getUser = async(req,res) =>{
    try{
        // User ID comes from verifyToken middleware
        const userId = req.id;

        // Find user and exclude password field from response
        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }

        res.status(200).json({
            success:true,
            user
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


module.exports = {
    register,
    login,
    logout,
    getUser
}