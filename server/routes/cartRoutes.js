const express = require('express')
const { addToCart,removeFromCart, incrementQuantity, decrementQuantity, checkOut, clearCart} = require('../controllers/cartController')
const verifyToken = require('../middlewares/verifyToken')
const cartRouter = express.Router()

// Shopping cart routes (all require authentication)
cartRouter.post("/add",verifyToken,addToCart)                    // Add item to cart
cartRouter.delete("/remove/:id",verifyToken,removeFromCart)      // Remove item from cart
cartRouter.post("/increment/:id",verifyToken,incrementQuantity)  // Increase item quantity
cartRouter.post("/decrement/:id",verifyToken,decrementQuantity)  // Decrease item quantity
cartRouter.post("/checkout",verifyToken,checkOut)               // Create Stripe checkout session
cartRouter.get("/clear",verifyToken,clearCart)                  // Clear entire cart


module.exports = cartRouter