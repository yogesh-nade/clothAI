// Home Page - Landing page with hero section and product grid
import React from 'react'
import Products from './Products'
import Hero from '../components/Hero'

const Home = () => {
  return (
    <>
    {/* Hero banner with main messaging */}
    <Hero/>
    {/* Product catalog display */}
    <Products/>
    </>
  )
}

export default Home
