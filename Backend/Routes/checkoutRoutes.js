const express = require('express')

const Checkout = require('../Models/Checkout');
const Cart = require('../Models/CartModel');
const Product = require('../Models/Products');
const Order = require('../Models/Order');



const {protect} = require('../Middlewares/Auth');


const router = express.Router();

//@route POST / api / checkout
//Create a new checkout session
//@access private

router.post('/', protect ,async(req, res) => {
    const {checkoutItems, shippingAddress, paymentMethod, totalPrice} = req.body;
    // console.log(checkoutItems)

    if(!checkoutItems || checkoutItems.length === 0 ){
        return res.status(400).json({message: "No items in checkout!"})
    }

    try {
        
        //create a new checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems : checkoutItems,
            shippingAddress,
            paymentMethod, 
            totalPrice,
            paymentStatus: "Pending",
            isPaid : false,
        });

        console.log(`Checkout created for user : ${req.user._id}`);

        res.status(201).json(newCheckout)

    } catch (error) {
        console.error("Error Creating checkout session!");
        res.status(500).json({message: "Server Error!"});
    }
});


//@route PUT/ api / checkout/:id/pay
//To update checkout to mark as paid after successful payment
// @access private


router.put('/:id/pay', protect, async(req, res) => {
    const {paymentStatus, paymentDetails} = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id);

        if(!checkout){
            return res.status(404).json({message: "Checkout Not Found!"});
        }

        if(paymentStatus === 'paid'){
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();

            res.status(200).json(checkout);
        }else{
            res.status(400).json({message: "Invalid Payment Status!"})
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error!"})
        
    }

});



//@route POST/ api / checkout/:id / finalize
//Finalize checkout and convert to an order after payment confirmation
//@access private

router.post('/:id/finalize', protect, async(req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if(!checkout){
            return res.status(404).json({message: "Chechout Not Found!"})
        }

        if(checkout.isPaid && !checkout.isFinalized){
            //Create final order based on the checkout details

            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress : checkout.shippingAddress,
                paymentMethod : checkout.paymentMethod,
                totalPrice : checkout.totalPrice,
                isPaid : true,
                paidAt: checkout.paidAt,
                isDevlivered : false,
                paymentStatus : "paid",
                paymentDetails : checkout.paymentDetails,
            });


            //Mark the checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            //Delete the cart associated with the user
            await Cart.findOneAndDelete({user: checkout.user});
            res.status(201).json(finalOrder) ;
        }else if(checkout.isFinalized){
            res.status(400).json({message: "Checkout already finalized!"})
        }else{
            res.status(400).json({message: "Checkout is not paid!"})
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error!"})
    }
})


module.exports = router;