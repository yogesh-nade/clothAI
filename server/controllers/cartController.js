const User = require("../models/user")
const stripe = require('stripe')(process.env.STRIPE_KEY) // Initialize Stripe for payment processing

// Add product to user's shopping cart
const addToCart = async (req, res) => {
    const { id, title, description, image, price, category } = req.body
    const userId = req.id // From verifyToken middleware

    try {
        // Find authenticated user
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized."
            })
        }

        // Check if product already exists in cart
        const existingProduct = user.cart.find(item => item.id == id)
        if (existingProduct) {
            return res.status(200).json({
                success: false,
                message: "Already in cart.",
            })
        }
        
        // Create new cart item with quantity 1
        const product = {
            id,
            title,
            description,
            image,
            price,
            category,
            quantity: 1,
        }

        // Add to user's cart and save
        user.cart.push(product)
        await user.save()

        res.status(200).json({
            success: true,
            message: "Added to cart",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Remove product completely from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.id
        const user = await User.findById(userId)
        const itemId = req.params.id
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized."
            })
        }

        // Find product index in cart
        const productIndex = user.cart.findIndex(item => item.id == itemId)
        if (productIndex == -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            })
        }

        // Remove item from cart array
        user.cart.splice(productIndex, 1)
        await user.save()

        res.status(200).json({
            success: true,
            message: "Item removed from cart."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Increase quantity of specific cart item
const incrementQuantity = async (req, res) => {
    const userId = req.id
    const itemId = req.params.id

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized."
            })
        }

        // Find product in cart
        const productIndex = user.cart.findIndex(item => item.id === itemId)
        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            })
        }

        // Increment quantity by 1
        user.cart[productIndex].quantity += 1
        await user.save()

        res.status(200).json({
            success: true,
            message: "Quantity updated.",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Decrease quantity of specific cart item (minimum quantity is 1)
const decrementQuantity = async (req, res) => {
    const userId = req.id
    const itemId = req.params.id

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized."
            })
        }

        // Find product in cart
        const productIndex = user.cart.findIndex(item => item.id === itemId)
        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            })
        }

        // Only decrement if quantity is greater than 1
        if (user.cart[productIndex].quantity > 1) {
            user.cart[productIndex].quantity -= 1
            await user.save()
        } else {
            return res.status(400).json({
                success: false,
                message: "Quantity should not be less than 0.",
            })
        }

        res.status(200).json({
            success: true,
            message: "Quantity updated",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Create Stripe checkout session for payment processing
const checkOut = async (req, res) => {
    try {
      // Create Stripe checkout session with cart items
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: req.body.items.map(item => {
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.title,
              },
              unit_amount: item.price * 100, // Convert to cents
            },
            quantity: item.quantity,
          };
        }),
        success_url: `${process.env.ORIGIN}/success`, // Redirect after successful payment
        cancel_url: `${process.env.ORIGIN}/cancel`,   // Redirect if payment cancelled
      });
  
      res.status(200).json({ success: true, url: session.url });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// Clear all items from user's cart
const clearCart = async(req,res) =>{
    try{
        const userId = req.id
        const user = await User.findById(userId)

        if(!user){
            return res.status(401).json({
                success: false,
                message: "You are not authorized."
            })
        }
        
        // Empty the cart array
        user.cart = []
        await user.save()

        res.status(200).json({
            success: true,
            message: "Cart clear."
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    checkOut,
    clearCart
}