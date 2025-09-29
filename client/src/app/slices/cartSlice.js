// Shopping Cart Slice - Manages cart items and quantities
import { createSlice } from '@reduxjs/toolkit'

// Initial state: empty cart
const initialState = {
    cart: [], // Array of cart items with id, title, price, quantity, etc.
}

// Cart slice with CRUD operations
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Replace entire cart (used for server sync)
        setCart: (state, action) => {
            state.cart = action.payload
        },
        
        // Add new item to cart with quantity 1
        addToCart: (state, action) => {
            state.cart = [...state.cart, { ...action.payload, quantity: 1 }];
        },
        
        // Remove item completely from cart
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item.id !== action.payload);
        },
        
        // Increase item quantity by 1
        incrementQuantity: (state, action) => {
            const item = state.cart.find(item => item.id == action.payload);
            if (item) {
                item.quantity += 1;
            }
        },
        
        // Decrease item quantity by 1 (minimum: 1)
        decrementQuantity: (state, action) => {
            const item = state.cart.find(item => item.id == action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        }
    },
})

// Export actions and reducer
export const { 
    setCart, 
    addToCart, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity 
} = cartSlice.actions

export default cartSlice.reducer
