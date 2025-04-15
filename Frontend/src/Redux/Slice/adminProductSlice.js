import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import axios from 'axios'

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`

const AUTH_HEADER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`

//thunk for get all admin products

export const fetchAdminProducts = createAsyncThunk('adminProducts/fetchAdminProducts', async() => {


    const response = await axios.get(`${API_URL}/api/admin/products`, 
        {
            headers : {
                Authorization : AUTH_HEADER_TOKEN
            }
        });

    return response.data;
});


//Async thunk for create a new product

export const createProduct = createAsyncThunk('adminProducts/createProduct', async(producData) => {

    const response = await axios.post(`${API_URL}/api/admin/products` , 
        producData, 
        {

        headers : {
            Authorization : AUTH_HEADER_TOKEN,
        }
    })

    return response.data;
});


//Async thunk for updating an existing product

export const updateProduct = createAsyncThunk('adminProducts/updateProducts', async({id, productData})=> {

    const response = await axios.put(`${API_URL}/api/products/${id}`, 
        productData, 
        {
            headers : {
                Authorization : AUTH_HEADER_TOKEN,
            }
        }
    )

    return response.data;
})


//Async thunk for deleting a product

export const deleteProduct = createAsyncThunk('adminProducts/deleteProduct', async(id) => {

    await axios.delete(`${API_URL}/api/products/${id}`, 
        {
            headers : {
                Authorization : AUTH_HEADER_TOKEN,
            }
        }
    )
    return id;
});



const adminProductSlice = createSlice({
    name: 'adminProducts',
    initialState : {
        products : [],
        loading : false,
        error : null,
    },
    reducers : {},

    extraReducers : (builder) =>{
        builder

        //Getting all products
        .addCase(fetchAdminProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAdminProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        })
        .addCase(fetchAdminProducts.rejected, (state, action) => {
            state.loading =false;
            state.error = action.error.message;
        })

        //Creating a product
        .addCase(createProduct.fulfilled, (state,action) => {
            state.products.push(action.payload);
        })

        //update products
        .addCase(updateProduct.fulfilled, (state,action)=>{
            const prodIndex = state.products.findIndex((product) => product._id ===action.payload._id);
            if(prodIndex !== -1){
                state.products[prodIndex] = action.payload;
            }
        })

        //Delete product 
        .addCase(deleteProduct.fulfilled, (state,action) => {
            state.products = state.products.filter((product) => product._id !== action.payload)
        })

    }
})


export default adminProductSlice.reducer;