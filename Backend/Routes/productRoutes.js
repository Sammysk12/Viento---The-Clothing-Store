const express = require('express')


const Product = require('../Models/Products');



const {protect, isAdmin} = require('../Middlewares/Auth');

const router = express.Router();


//@route POST/ api/products
//Create a new product
//@access - private/admin
 

router.post('/' , protect, isAdmin, async(req, res) =>{
    try {
        const {name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku} = req.body;

        const product = new Product({
            name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku, user : req.user._id,
        })


        const createdProduct = await product.save();

        res.status(201).json(createdProduct);


    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error!")
        
    }
})


//@route /put/api/products/:id 
//Update existing product by it's id 
//@access private/admin

router.put('/:id' , protect, isAdmin, async (req, res) =>{
    try {
        const {name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku} = req.body;

    //Find product by it's ID
    const product = await Product.findById(req.params.id)

    if(product) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discountPrice = discountPrice || product.discountPrice;
        product.countInStock = countInStock || product.countInStock;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.sizes =  sizes|| product.sizes;
        product.colors = colors || product.colors;
        product.collections = collections || product.collections;
        product.material = material || product.material;
        product.gender = gender || product.gender;
        product.images = images || product.images;
        product.isFeatured = isFeatured!== undefined ? isFeatured : product.isFeatured;
        product.isPublished = isPublished!== undefined ? isPublished : product.isPublished;
        product.tags =  tags|| product.tags;
        product.dimensions =  dimensions|| product.dimensions;
        product.weight =  weight|| product.weight;
        product.sku =  sku|| product.sku;


        //Save the product in database
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    }else{
        res.status(404).json({message : "Product Not Found!"})
    }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error!");
    }
})


//@route /delete/api/products/:id 
//Delete existing product by it's id 
//@access private/admin

router.delete('/:id', protect, isAdmin, async(req, res)=>{
    try {
        //Find product by it's id;
        const deletingProduct = await Product.findById(req.params.id);

        if(deletingProduct){
            //Removing from db
            await deletingProduct.deleteOne();
            res.json({message : "Product Removed!"})
        }else{
            res.status(404).json({message: "Product Not Found!"})
        }


    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error!");
        
    }
})


//@route GET/api/products
//Get all procts with optional query filters
//access public

router.get("/", async(req,res) =>{
    try {
        const {collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit} = req.query;

        let query = {}; 

        //Filteing logic

        if(collection && collection.toLocaleLowerCase() !== "all"){
            query.collections = collection;
        }
        if(category && category.toLocaleLowerCase() !== "all"){
            query.category = category;
        }
        if(material){
            query.material = {$in: material.split(",")};
        }
        if(brand){
            query.brand = {$in: brand.split(",")};
        }
        if(size){
            query.size = {$in: size.split(",")};
        }
        if(color){
            query.color = {$in: [color]};
        }
        if(gender){
            query.gender = gender;
        }
        if(minPrice || maxPrice){
            query.price = {};
            if(minPrice) query.price.$gte = Number(minPrice)
            if(maxPrice) query.price.$lte = Number(maxPrice)
        }

        if(search){
            query.$or = [
                {
                name: {$regex : search, $options : "i"}
                },
                {
                description: {$regex : search, $options : "i"}
                }

        ]
        }



        //Sorting Logic
        let sort = {}; 

        if(sortBy){
            switch(sortBy){
                case "priceAsc" : 
                sort = {price : 1};
                break;

                case "priceDesc" :
                sort = {price : -1};
                break;
                
                case "popularity" : 
                sort = {rating : -1};
                break;
                
                default : 
                break;
            }
        }



        //Fetch the products from the database 
        let products = await Product.find(query).sort(sort).limit(Number(limit)) || 0;
        res.json(products);

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error!");
    }
})


//@route GET/api/products/best-seller
//Retrieve the product with highest rating (Only 1)
// @access public

router.get('/best-seller', async(req, res) =>{
    
    try {
        const bestSeller = await Product.findOne().sort({rating : -1})

            if(bestSeller){
                res.status(200).json(bestSeller);
            }else{
                res.status(404).json({message : "No Best Seller Found!"})
            }

    } catch (error) {
        console.log(error);
        res.status(500).status("Server Error!")
        
    }
});



//@route GET/api/products/new-arrivals
//To retrieve new(latest) arrivals
// @access public

router.get('/new-arrivals', async(req, res) => {
    try{
        //fetch the latest 8 products
        const newArrivals = await Product.find().sort({createdAt: -1}).limit(8);
        res.json(newArrivals)
    }catch (error){
        console.log(error);
        res.status(500).json("Server Error!")
    }
})



//@route GET/api/products/:id
// To GET a single product by ID

router.get("/:id", async(req,res) =>{
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if(product){
            res.status(200).json(product);
        }else{
            res.json(404).json({message : "Product Not Found!"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error!"})
    }
})



//@route GET /api/products/similar/:id
//To get similar products based on the current product's gender and category
//@access public 

router.get('/similar/:id', async(req,res) => {
    const {id} = req.params;
    try {
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({message: "Product Not Found!"})
        }

        const  similarProducts = await Product.find({
            _id : {$ne : id}, //Excluding the current product which is displayed
            gender: product.gender,
            category: product.category,
        }).limit(4);


        res.status(200).json(similarProducts);


    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error!")
    }

})





module.exports = router;