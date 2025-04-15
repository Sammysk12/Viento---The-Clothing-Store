const express = require('express')


const User = require('../Models/User');


const jwt  = require('jsonwebtoken');




const router = express.Router();

//@route POST /api/users/register
// To create new user
// @access - public



const {protect} = require('../Middlewares/Auth')



router.post('/register', async (req,res) => {
    const {name, email , password} = req.body;

    try{
        //Registration Logic
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json( {message: "User already exists!"});
        }

        //getting data in user (name, email and pasword)
        user = new User({name, email , password});

        //creates a new user if there is not any existing user
        await user.save();

        //created JWT token
        const payload = {user: {id: user._id, role : user.role}}

        //Sign and return the token along with the user data
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "24h"} , (err, token) => {
            if(err){
                throw err;
            }

            //Send the user and token in response
            res.status(201).json({
                user: {
                    _id: user._id,
                    name : user.name,
                    email : user.email,
                    role : user.role
                },
                token,
            })
        })

    }catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
})





//@route POST /api/users/login
// To authenticate user
// @access - public

router.post('/login', async(req, res) =>{
    const {email, password} = req.body;

    try{
        //find user by email
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message : "Invalid Credentials!"})
            
        }
        console.log(user);
        

        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({ messsage: "Invalid Credentials!"})
        }

        
        //created JWT token
        const payload = {user: {id: user._id, role : user.role}}

        //Sign and return the token along with the user data
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "24h"} , (err, token) => {
            if(err){
                throw err;
            }

            //Send the user and token in response
            res.json({
                user: {
                    _id: user._id,
                    name : user.name,
                    email : user.email,
                    role : user.role
                },
                token,
            })
        })

        




    } catch (err){
        console.log(err);
        res.status(500).send("Server Error" )
    }

})



//@Route GET /api/users/profile
//@desc Get logged in user's profile (Protected route)

router.get('/profile', protect, async(req, res) => {
    res.json(req.user);
})


















module.exports = router;