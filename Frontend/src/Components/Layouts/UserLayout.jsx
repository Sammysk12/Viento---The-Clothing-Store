import React from 'react'


//importing some components
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <div>

        {/* User Layout is basically contain 3 common but important components Header, Main Content and Footer */}
        
        
        {/* Header */}
        <Header/>

        {/* Main */}
        <main>
          <Outlet />
          
          </main>        

        {/* Footer */}
       <Footer/>
    </div>
  )
}

export default UserLayout