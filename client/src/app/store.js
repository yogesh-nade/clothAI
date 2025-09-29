// Redux Store Configuration - Central state management
import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'  // User authentication state
import cartSlice from './slices/cartSlice'  // Shopping cart state

// Configure Redux store with auth and cart slices
export const store = configureStore({
  reducer: {
    auth: authSlice,  // User login/profile data
    cart: cartSlice   // Shopping cart items
  },
})