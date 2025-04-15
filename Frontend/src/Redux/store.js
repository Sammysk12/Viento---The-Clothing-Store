import {configureStore} from '@reduxjs/toolkit'


import authReducer from './Slice/authSlice'
import productReducer from './Slice/productSlice'
import cartReducer from './Slice/cartSlice'
import checkoutReducer from './Slice/checkoutSlice'
import orderSlice from './Slice/orderSlice'
import adminSlice from './Slice/adminSlice'
import adminProductsReducer from './Slice/adminProductSlice'
import adminOrdersReducer from './Slice/adminOrderSlice'

const store = configureStore({
    reducer : {
        auth : authReducer,
        products : productReducer,
        cart: cartReducer,
        checkout : checkoutReducer, 
        orders : orderSlice,
        admin : adminSlice,
        adminProducts : adminProductsReducer,
        adminOrders : adminOrdersReducer,
    }
})


export default store;