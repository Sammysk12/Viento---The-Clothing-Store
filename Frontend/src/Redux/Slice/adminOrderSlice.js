import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import axios from 'axios'

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`

const AUTH_HEADER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`


//Thunk for fetch all orders(admin only)

export const fetchAllOrders = createAsyncThunk('adminOrders/fetchAllOrders', async(_, {rejeTWithValue}) => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/orders`,  
            {
                headers : {
                    Authorization : AUTH_HEADER_TOKEN,
                }
            }
        )

        return response.data;

    } catch (error) {
        return rejeTWithValue(error.response.data);
    }
})


//Thunk for update order delivery status (admin only)
export const updateOrderStatus = createAsyncThunk('adminOrders/updateOrderStatus', async({id, status}, {rejeTWithValue}) => {
    
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,  
            {status},
            {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem("userToken")}`,
                }
            }
        )

       console.log("id : ", id)
       console.log("status : " ,status)
       console.log(response)
        return response.data;
        

    } catch (error) {
        return rejeTWithValue(error.response.data);
    }
})



//Thunk for delete order(admin only)
export const deleteOrder = createAsyncThunk('adminOrders/deleteOrder', async(id, {rejeTWithValue}) => {
    try {
        await axios.get(`${API_URL}/api/admin/orders/${id}`,  
            {
                headers : {
                    Authorization : AUTH_HEADER_TOKEN,
                }
            }
        )

        return id;

    } catch (error) {
        return rejeTWithValue(error.response.data);
    }
});


const adminOrdersSlice = createSlice({
    name: "adminOrders",
    initialState : {
        orders: [],
        totalOrders : 0,
        totalSales : 0,
        loading : false,
        error : null,
    },

    reducers: {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchAllOrders.pending, (state)=> {
            state.loading =true;
            state.error = null;
        })
        .addCase(fetchAllOrders.fulfilled, (state, action)=> {
            state.loading =false;
            state.orders = action.payload;
            state.totalOrders = action.payload.length;


            const totalSales = action.payload.reduce((acc, order) => {
                return acc + order.totalPrice;
            }, 0)
            state.totalSales = totalSales;
        })
        .addCase(fetchAllOrders.rejected, (state,action)=> {
            state.loading =false;
            state.error = action.payload.message;
        })

        //for update order status
        .addCase(updateOrderStatus.fulfilled, (state, action) => {
            const updatedOrder = action.payload;
          
            const orderIndex = state.orders.findIndex((order) => order._id ===updatedOrder._id);
            if(orderIndex !== -1){
                state.orders[orderIndex] = updatedOrder;
            }
        })
        //for ddelete order
        .addCase(deleteOrder.fulfilled, (state, action) => {
           state.orders = state.orders.filter((order)=>{
            order._id !== action.payload;
           })
        })
    }

})



export default adminOrdersSlice.reducer;