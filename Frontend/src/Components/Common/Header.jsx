import React from 'react'


//importing some components
import Topbar from './Topbar'
import Navbar from './Navbar'

const Header = () => {
  return (
    <header className='border-b border-gray-200'> {/* This contains 3 common layouts topbar, navbar and cart drawer */}
    <Topbar/>
    <Navbar/>
    </header>
  )
}

export default Header