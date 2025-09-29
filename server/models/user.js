const mongoose = require('mongoose')

// User schema definition with embedded cart functionality
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true // Ensure unique email addresses
    },
    password:{
        type:String,
        required:true // Will store hashed password
    },
    cart: [ // Embedded shopping cart array
        {
            id: String,        // Product ID
            title: String,     // Product name
            description: String, // Product description
            image: String,     // Product image URL/path
            price: Number,     // Product price
            category: String,  // Product category
            quantity: { type: Number, default: 1 } // Quantity in cart
        }
    ]
})

const User = mongoose.model('user',userSchema)

module.exports = User