const express = require('express')

const User = require('../../Models/User');


const {protect, isAdmin} = require('../../Middlewares/Auth');


const router = express.Router();


//@route GET/ api/ admin /users
//@desc Get all users (Admin only)
//@access private/admin

router.get('/users', protect, isAdmin, async(req, res) => {
    try {
        const users = await User.find({});
        res.json(users);

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error!"});
    }
})


//@route POST/ api / admin / users
//To add (create) a new user
//@acces private/admin

router.post('/users', protect, isAdmin, async(req, res) => {
    const {name, email, password, role} = req.body;

    try {
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({message: "User already exists!"})
        }

        user = new User({
            name,
            email,
            password,
            role: role || "customer",
        })

        await user.save();
        res.status(201).json({message: "User created successfully!", user})


    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error!"})
    }

})




//@route PUT/ api / admin / users /:id
//Update user information; like name email and role
//@acces private/admin 


router.put('/users/:id', protect, isAdmin, async(req, res) => {

    const  {name, email, role} = req.body;

    try {
        const user = await User.findById(req.params.id);

        if(user){
            user.name = name || user.name;
            user.email = email || user.email;
            user.role = role || user.role;
        }

        const updatedUser = await user.save();
        res.json({messaage : "User updated successfully!", user : updatedUser})

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error!"});
        
    }
})



//@route DELETE/ api / admin / users /:id
//Delete a user 
//@acces private/admin 

router.delete('/users/:id', protect, isAdmin, async(req,res) => {
    try {
        const user = await User.findById(req.params.id);

        if(user){
            await user.deleteOne();
            res.json({message: "User deleted successfully!"});
        }else{
            res.status(404).json({message : "User Not Found!"})
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Server Error!"})
        
    }
})

module.exports = router;