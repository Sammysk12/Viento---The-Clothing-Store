const express = require('express')

const Cart = require('../Models/CartModel')

const Product = require('../Models/Products');


const {protect} = require('../Middlewares/Auth');


const router = express.Router();


//Helper function to get a cart by user ID or Guest ID
    const getCart = async (userId, guestId) =>{
        if(userId){
            return await Cart.findOne({user : userId});
        }
        else if(guestId){
            return await Cart.findOne({guestId});
        }

        return null;
    }



//@route POST/ api /cart
//Add a product to the cart for a guest or a logged in user
// @access public


router.post('/', async(req, res)=> {
    const {productId, quantity, size, color, guestId, userId} = req.body;
    try {
        const product = await Product.findById(productId);

        if(!product) return res.status(404).json({message : "Product Not Found!"});

        //Determine if the user is logged in or guest

        let cart = await getCart(userId, guestId);

        //If the cart exists then we need to update it
        if(cart){
            const productIndex = cart.products.findIndex(
                (p) => 
                p.productId.toString() === productId 
                && p.size === size 
                && p.color === color 
            );

        if(productIndex > -1) {
            //If the product already exists, update the quantity
            cart.products[productIndex].quantity += quantity;
        }else{
            //add new product
            cart.products.push({
                productId,
                name: product.name,
                image: product.images[0].url,
                price: product.price,
                size,
                color,
                quantity,
            })
        }
        
        //Calculate the total price
        cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
        
        await cart.save();
        return res.status(200).json(cart);


        }else{
            //Create a new cart for guest or user 
            const newCart = await Cart.create({
                user : userId? userId : undefined,
                guestId : guestId ? guestId : "guest_"+ new Date().getTime(),
                
                products : [
                    {
                        productId,
                        name : product.name,
                        image : product.images[0]?.url,
                        price : product.price,
                        size, 
                        color,
                        quantity,
                    },
                ],
                totalPrice : product.price* quantity,
            });
            console.log(guestId)
            return res.status(201).json(newCart);
            
        }



    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Server Error!"})
    }
})



//@route PUT/api/cart
//To update the product quantity in the cart for a guest or a logged-in user
//@access - public 

router.put('/', async(req, res) => {
    const {productId, quantity, size, color, guestId, userId} = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if(!cart) return res.status(404).json({message: "Cart Not Found!"});


        const productIndex = cart.products.findIndex(
            (p) =>
            p.productId.toString() === productId && 
            p.size ===size && 
            p.color === color
        )

        if(productIndex > -1){
            //update quantity
            if(quantity > 0 ){
                cart.products[productIndex].quantity = quantity;
            }else{
                cart.products.splice(productIndex, 1) // Removes the product if quantity is 0
            }

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

            await cart.save();
            return res.status(200).json(cart);
            
            


        }else{
            return res.status(404).json({message : "Product Not found in cart!"})
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Server Error!"})
    }
})


//@route DELETE/ api/ cart.
//Remove a product from the cart

router.delete('/', async(req, res) =>{
    const {productId, size, color, guestId, userId} = req.body;
    try{
        let cart = await getCart(userId, guestId);

        if(!cart) return res.status(404).json({message: "Cart Not Found!"});

        const productIndex = cart.products.findIndex(
            (p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        )

        if(productIndex > -1){
            cart.products.splice(productIndex, 1);

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity, 
                0
            );
            await cart.save();
            return res.status(200).json(cart);

        }else{
            return res.status(404).json({message: "Product Not Found in Cart!"})
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "server Error!"});
        
    }
})


//@route GET/ api/cart
//Get logged in user's or guset user's cart
// @access public

router.get('/', async(req, res)=> {

    const {userId, guestId} = req.query;

    try {
        const cart = await getCart(userId, guestId);

        if(cart){
            res.json(cart);

        }else{
            res.status(404).json({message : "Cart Not Found!"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Server Error!"})
    }

})



//@route POST/api/cart/merge
//To merge guset cart into user cart on login

router.post('/merge',protect ,async(req, res) => {
    const {gusetId} = req.body;

    try {
        //Find the guest cart and user cart
        const guestCart = await Cart.findOne({gusetId});
        const userCart = await Cart.findOne({user: req.user._id})

        if(guestCart){
            if(guestCart.products.length === 0){
                return res.status(400).json({message : "Guest cart is empty"});
            }

            if(userCart){
                //Merge guest cart into user cart
                guestCart.products.forEach((guestItem) =>{
                    const productIndex = userCart.products.findIndex((item) =>
                        item.productId.toString() === guestItem.productId.toString() &&
                        item.size === guestItem.size &&
                        item.color === guestItem.color
                    );

                    if(productIndex > -1){
                        //If the item exists in the user cart, update the quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    }else{
                        //Otherwise, add the product item to the cart
                        userCart.products.push({...userCart.products, guestItem})
                    }                   
                });


                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price *item.quantity, 0
                );

                await userCart.save();

                //Remove the guset cart after merging
                try {
                    await Cart.findOneAndDelete({gusetId});
                } catch (error) {
                    console.error("Error deleting guset cart! : ", error);
                    
                }

                res.status(200).json(userCart)

            }else{
                //If the user has no existing cart, assign the cart to the user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;

                await guestCart.save();

                res.status(200).json(guestCart);
            }



        }else{
            if(userCart){
                    //Guest cart has already been merged then return user cart

                    return res.status(200).json(userCart)
            }
            res.status(404).json({message: "Guest Cart Not Found!"})

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Server Error!"})
    }

})



module.exports = router;