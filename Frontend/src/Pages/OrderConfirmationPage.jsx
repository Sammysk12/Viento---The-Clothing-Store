import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckOut from '../Components/Cart/CheckOut';
import { clearCart } from '../Redux/Slice/cartSlice';

const OrderConfirmationPage = () => {
   
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {checkOut} = useSelector((state) => state.checkout);


    //Clear the cart when order is confirmed

    useEffect(()=>{
        if(CheckOut && checkOut._id){
            dispatch(clearCart());
            localStorage.removeItem("cart");
            navigate('/my-order')
        }
    }, [checkOut, dispatch, navigate])



    const calculateEstimatedDelivery = (createdAt) =>{
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() +10);
        return orderDate.toLocaleDateString();
    }   

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white'>
        <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>Thank You for Your Order!</h1>

        {checkOut && (
            <div className='p-6 rounded-lg border'>
                <div className='flex justify-between mb-20'>
                    {/* Order ID and Date */}
                    <div>
                   <h2 className='text-xl font-semibold'>Order ID: {checkOut.__id}</h2>
                   <p className='text-gray-500'>Order Date: {new Date(checkOut.createdAt).toLocaleDateString()}</p>
                   </div>

                    {/* Estimated Delivery */}
                    <div >
                        <p className='text-emerald-700 text-sm'>Estimated Delivery: {calculateEstimatedDelivery(checkOut.createdAt)}</p>
                    </div>
                </div>

                <div className='mb-20 '>
                    {checkOut.checkouItems.map((item) =>{
                        return (
                            <div key={item.productId} className='flex items-center mb-4'>
                                <img src={item.image} alt={item.name} className='h-16 w-16 object-cover rounded-md mr-4'/>
                                <div>
                                    <h4 className='text-md font-semibold'>{item.name}</h4>
                                    <p className='text-sm text-gray-500'>{item.color} | {item.size}</p>
                                </div>

                                <div className='ml-auto text-right'>
                                    <p className='text-md'>${item.price}</p>
                                    <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Payment and Delivery Info */}
                <div className='grid grid-cols-2 gap-8'> 
                    {/* {Payment Info} */}
                    <div>
                        <h4 className='text-lg font-semibold mb-2'>Payment</h4>
                        <p className='text-gray-600'>Paypal</p>
                    </div>

                    {/* Delivery Info */}
                    <div>
                        <h4 className='text-lg font-semibold mb-2'>Delivery</h4>
                        <p className='text-gray-600'>{checkOut.shippingAddress.address}</p>
                        <p className='text-gray-600'>{checkOut.shippingAddress.city}, {checkOut.shippingAddress.country}</p>
                    </div>

                </div>

            </div>
        )}
    </div>
  )
}

export default OrderConfirmationPage