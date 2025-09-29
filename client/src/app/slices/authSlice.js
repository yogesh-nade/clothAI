// Authentication Slice - Manages user login state
import { createSlice } from '@reduxjs/toolkit'

// Initial state: no user logged in
const initialState = {
  user: null, // Contains user data when logged in (id, name, email, cart)
}

// Auth slice with user management actions
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set user data after login or app initialization
    setUser: (state, action) => {
      state.user = action.payload
    },
  }, 
})

// Export actions and reducer
export const { setUser } = authSlice.actions
export default authSlice.reducer