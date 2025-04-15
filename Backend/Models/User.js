const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({

    //1. Name: 
        name: {
            type: String,
            required :true,
            trim : true,
        },

        email : {
            type : String,
            required : true,
            unique: true,
            trim: true,
            match: [/.+\@.+\..+/, "Please enter a valid email address"]
        },


        password : {
            type: String,
            required: true, 
            minLength : 6,
        },

        role : {
            type : String,
            enum : ["customer", "admin"],
            default: "customer"
        },
}, 
{timestamps : true}
)


//Password Hash middlware


//This is a moongoose middlware package hook
userSchema.pre("save" , async function(next) {
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})


//Mactch user entered password to Hashed Password

userSchema.methods.matchPassword = async function(enteredPassword) {
    
    return await bcrypt.compare(enteredPassword, this.password);
}


module.exports = mongoose.model("User", userSchema);
