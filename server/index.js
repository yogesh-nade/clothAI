// Load environment variables from .env file
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// Import route handlers
const authRouter = require('./routes/authRoutes')
const cartRouter = require('./routes/cartRoutes')
const productRouter = require('./routes/productRoutes')

// Import database connection function
const connectDb = require('./config/db')

const app = express()
const port = 3000

// Establish database connection
connectDb()

// Middleware setup
app.use(express.json()) // Parse JSON request bodies
app.use(cors({
    origin:[process.env.ORIGIN,'https://clothai.netlify.app'], // Allow cross-origin requests from frontend
    credentials:true // Allow cookies to be sent with requests
}))
app.use(cookieParser()) // Parse cookies from request headers
app.use('/uploads', express.static('uploads')) // Serve static files from uploads directory

// API route handlers
app.use("/api/auth",authRouter)     // Authentication routes (login, register, logout)
app.use("/api/cart",cartRouter)     // Shopping cart operations
app.use("/api/products", productRouter) // Product management (AI-generated clothing)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => { 
  console.log(`Server listening on port ${port}`)
})