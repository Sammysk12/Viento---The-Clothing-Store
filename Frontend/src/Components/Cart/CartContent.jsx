import React from 'react'

import {RiDeleteBin3Line} from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '../../Redux/Slice/cartSlice';

    const CartContent = ({cart, userId, guestId}) => {

    const dispatch = useDispatch();


    //Handle adding or substracting to cart

    const handleToCart = (productId, delta, quantity, size, color) => {

        const newQuantity = quantity + delta;

        if(newQuantity >=1){
            dispatch(updateCartItemQuantity({
                productId, 
                quantity : newQuantity,
                userId,
                guestId,
                size,
                color
            }));
        }
    };


    const handleRemoveFromCart =(productId, size, color) => {

        dispatch(removeFromCart({
            productId,
            guestId,
            userId,
            size,
            color
        }))
    }

    
  return (
    <div>
        {
            cart.products.map((product, index) =>{
                return(
                    <div key={index} className='flex items-start justify-between py-4 border-b'> 
                        <div className='flex items-start'>
                            <img src={product.image} alt="Product name"  className='w-20 h-24 object-cover mr-4 rounded'/>
                            <div>
                                <h3>{product.name}</h3>
                                <p className='text-sm text-gray-500'>Size: {product.size} | Color: {product.color}</p>
                                <div className='flex items-center mt-2'>
                                    <button className='border-rounded px-2 py-1 text-xl font-medium hover:text-orange-500' onClick={()=> handleToCart(product.productId, -1, product.quantity, product.size, product.color)}>-</button>
                                    <span className='mx-4'>{product.quantity}</span>
                                    <button className='border-rounded px-2 py-1 text-xl font-medium hover:text-orange-500' onClick={()=> handleToCart(product.productId, +1, product.quantity, product.size, product.color)}>+</button>
                                </div>
                            </div>
                        </div>
                            <div>
                                <p>$ {product.price.toLocaleString()}</p>
                                <button onClick={()=> handleRemoveFromCart(product.productId, product.size, product.color)}>
                                    <RiDeleteBin3Line className='h-6 w-6 mt-2 text-red-600'/>
                                </button>
                            </div>
                    </div>
                )
            })
        }
    </div>
  )
}

export default CartContent