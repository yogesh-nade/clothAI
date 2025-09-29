const jwt = require('jsonwebtoken')

// Middleware to verify JWT token from cookies for protected routes
const verifyToken = (req,res,next) =>{
    try{
        // Extract token from HTTP-only cookie
        const token = req.cookies.token;

        // Check if token exists
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token missing."
            })
        }

        // Verify token using JWT secret
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Unauthorized."
            })
        }
        
        // Attach user ID to request object for use in route handlers
        req.id = decoded.id
        next() // Continue to next middleware/route handler

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message 
        })
    }
}

module.exports = verifyToken