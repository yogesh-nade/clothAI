// Loader Component - Full-screen loading spinner for async operations
import React from 'react'

const Loader = () => {
  return (
    // Full-screen centered loading animation
    <div className='h-screen w-full flex items-center justify-center'>
      <div className="loader"></div>
    </div>
  )
}

export default Loader
