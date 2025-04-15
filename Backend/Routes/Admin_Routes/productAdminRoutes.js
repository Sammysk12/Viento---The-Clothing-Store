const express = require('express')
const router = express.Router();

const Product = require('../../Models/Products');


const {protect, isAdmin} = require('../../Middlewares/Auth');

//@route GET /api/admin/products
//Get all products (admin only)
//@access private admin only


router.get('/', protect, isAdmin, async(req, res)=> {

    try {
        
        const products = await Product.find({});
        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Server Error!"})
    }
})

module.exports = router;