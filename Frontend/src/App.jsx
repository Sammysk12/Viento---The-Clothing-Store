import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserLayout from './Components/Layouts/UserLayout'
import { BrowserRouter } from 'react-router-dom'
import Home from './Pages/Home'

import {Toaster} from 'sonner'; 
import Login from './Pages/Login'
import Register from './Pages/Register'
import Profile from './Pages/Profile'
import CollectionPage from './Pages/CollectionPage'
import ProductDetails from './Components/Products/ProductDetails'
import CheckOut from './Components/Cart/CheckOut'
import OrderConfirmationPage from './Pages/OrderConfirmationPage'
import OrderDetailsPage from './Pages/OrderDetailsPage'
import MyOrders from './Pages/MyOrders'
import AdminLayout from './Components/Admin/AdminLayout'
import AdminHomePage from './Pages/AdminHomePage'
import UserManagement from './Components/Admin/UserManagement'
import ProductManagement from './Components/Admin/ProductManagement'
import EditProductsPage from './Components/Admin/EditProductsPage'
import OrderManagement from './Components/Admin/OrderManagement'

import {Provider} from 'react-redux';
import store from './Redux/store';
import ProtectedRoute from './Components/Common/ProtectedRoute'



const App = () => {
  return (

    <Provider store={store}>

    <BrowserRouter>
    <Toaster position = 'top-right'/>
      
    
    

    {/* //React5 router is used
    //Routing makes faster rendering of components */}
   <Routes>

    {/* Indivisual Route for home page */}
    <Route path='/' element={<UserLayout/>}>
    <Route index element={<Home/>}/>
    <Route path='login' element={<Login/>}></Route>
    <Route path='register' element={<Register/>}></Route>
    <Route path='profile' element={<Profile/>}></Route>
    <Route path='collections/:collection' element={<CollectionPage/>}></Route>
    <Route path='products/:id' element={<ProductDetails/>}></Route>
    <Route path='checkout' element={<CheckOut/>}></Route>
    <Route path='order-confirmation' element={<OrderConfirmationPage/>}></Route>
    <Route path='order/:id' element={<OrderDetailsPage/>}></Route>
    <Route path='my-orders' element={<MyOrders/>}></Route>
    
    </Route> {/*This layout contains 3  main commin layouts these are Topbar, Navbar + CartDrawer}
    
  
    
    {/* Indivisual Route for  page */}
    {/* <Route path=''/> */}

    {/* Indivisual Route for Admin Routes */}

    <Route path='/admin' element={<ProtectedRoute role='admin'><AdminLayout/></ProtectedRoute>}>
    <Route index element={<AdminHomePage/>}/>
    <Route path='users' element={<UserManagement/>}/>
    <Route path='products' element={<ProductManagement/>}/>
    <Route path='products/:id/edit' element={<EditProductsPage/>}/>
    <Route path='orders/' element={<OrderManagement/>}/>

    </Route>



   </Routes>
   </BrowserRouter>
  
    </Provider>
  )
}

export default App


//Traditionally when browser req data from browser and performs full page reload
// This may take time, that's why we use react-router-dom