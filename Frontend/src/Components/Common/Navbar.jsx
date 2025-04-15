import React, { useState } from 'react'
import { Link } from 'react-router-dom'



//importing some icons
import {HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight} from 'react-icons/hi2'
import Searchbar from './Searchbar'
import CartDrawer from '../Cart/CartDrawer'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'


const Navbar = () => {

    const {user} = useSelector(state => state.auth)

    const [cartDrawer, setCartDrawer] = useState(false);

    const [navbarOpen, setNavbarOpen] = useState(false)

    const toggleCartDrawer = () => {
        setCartDrawer(!cartDrawer);
    }
    const toggleNavbar= () => {
        setNavbarOpen(!navbarOpen);
    }

    const {cart} = useSelector((state) => state.cart);

    const cartItemCount = cart.products?.reduce((total, product) => total + product.quantity, 0) || 0;
    

  return (
    <div>
        <nav className='container mx-auto flex items-center justify-between py-4 px-6'>
            {/* Logo on the left */}
            <div>
                <Link to='/' className='text-2xl font-medium'>
                Viento
                </Link>
            </div>


            {/* For the different sections of shopping */}
            <div className='hidden md:flex space-x-6 ml-20'>
                <Link to="/collections/all?gender=Men" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                    Men
                </Link>
                <Link to="/collections/all?gender=Women" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                    Women
                </Link>
                <Link to="/collections/all?category=Top Wear" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                    Top Wear
                </Link>
                <Link to="/collections/all?category=Bottom Wear" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                    Bottom Wear
                </Link>
            </div>

            {/* Icons on the Right */}
            <div className='flex items-center space-x-4 '>
                {user && user.role ==="admin" &&(<Link to={`/admin`} className='block bg-black rounded px-2 text-sm text-white'>Admin</Link>)}
                <Link to='/profile' className='hover:text-black'>
                <HiOutlineUser className='h-6 w-6 text-gray-700'/>
                </Link>
                <button onClick={toggleCartDrawer} className='relative hover:text-black'>
                    <HiOutlineShoppingBag className='h-6 w-6 text-gray-700' />
                    {cartItemCount > 0 && (<span className='absolute -top-1 bg-rabbit-red text-white text-xs rounded-full px-2 py-0.5' >{cartItemCount}</span>) }
                    
                </button>


                {/* Search */}
                <div className='overflow-hidden'>

                <Searchbar/>
                </div>

                <button onClick={toggleNavbar} className='md:hidden'>
                    <HiBars3BottomRight className='h-6 w-6 text-gray-700'/>
                </button>
            
            
            </div>
        </nav>


        {/* Cart drawer */}
        <CartDrawer toggleCartDrawer={toggleCartDrawer} cartDrawer={cartDrawer}/>

        {/* Moible Navigation */}
        <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navbarOpen?  "translate-x-0" : "-translate-x-full"}`}>
        <div className='flex justify-end p-4'>
            <button onClick={toggleNavbar}>

            <IoMdClose className='h-6 w-6 text-gray-600' />
            </button>
        </div>

        {/* Moible menus */}
        <div className='p-4'>
            <h2 className='text-xl font-semibold mb-4'>Menu</h2>
            <nav className='space-y-4'>
                <Link to='/collections/all?gender=Men' onClick={toggleNavbar} className='block text-gray-600 hover:text-black'>
                Men
                </Link>
                <Link to='/collections/all?gender=Women' onClick={toggleNavbar} className='block text-gray-600 hover:text-black'>
                Women
                </Link>
                <Link to='/collections/all?category=Top Wear' onClick={toggleNavbar} className='block text-gray-600 hover:text-black'>
                TopWear
                </Link>
                <Link to='/collections/all?category=Bottom Wear' onClick={toggleNavbar} className='block text-gray-600 hover:text-black'>
                BottomWear
                </Link>
            </nav>
        </div>
        </div>

    </div> 
  )
}

export default Navbar