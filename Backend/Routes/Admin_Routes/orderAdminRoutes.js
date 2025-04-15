const express = require('express')

const Order = require('../../Models/Order');


const {protect, isAdmin} = require('../../Middlewares/Auth');


const router = express.Router();


//@route GET / api / admin/ orders
//Get all orders (admin only)
//@access private/admin

router.get('/', protect, isAdmin, async(req, res) =>{

    try {
        
        const orders = await Order.find({}).populate("user", "name email");
        res.json(orders);


    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Server Error!"});
    }
})



//@route PUT/ api/ admin /orders/:id
//Update order status
//@access private/admin


router.put('/:id', protect, isAdmin, async(req, res) =>{
    
    try {

        console.log(req.body.status)
        console.log(req.params.id)
        const order = await Order.findById(req.params.id).populate("user", "name");

        if(order){
            order.status = req.body.status || order.status;
            order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
            order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;


            const updatedOrder = await order.save();

            res.json(updatedOrder);

        }else{
            res.status(404).json({message : "Order Not Found!"})
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Server Error!"})
        
    }
})


//@route DELETE / api /admin/ orders /:id
//delete an order
//@access private/admin

router.delete('/:id', protect, isAdmin, async(req, res) =>{

    try {
        const order = await Order.findById(req.params.id);
        if(order){
            await order.deleteOne();
            res.json({message: "Order Removed!"});
            
        }else{
            res.status(404).json({message:"Order Not Found!"})
        }



    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error!"})
    }
})


module.exports = router;