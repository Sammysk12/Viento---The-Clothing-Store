const express = require('express')




//These are not working something is wrong with the env file its value are coming undefined
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET);
// console.log(process.env.CLOUDINARY_CLOUD_NAME);


//For now it is get fixed by this code
const result = require('dotenv').config({ debug: true });
if (result.error) {
    console.error("Error loading .env file:", result.error);
}


const router = express.Router()




const multer = require('multer')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier');




//Cloudinary configuration
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})



//Multer setup using memory storage 

//Telling that use directly RAM for storing files
const storage = multer.memoryStorage();

const upload = multer({storage});



router.post('/', upload.single("image"), async(req, res) => {
    try {
        
        if(!req.file){
            return res.status(400).json({message: "No file uploaded!"})
        }

        //Function to handle the stream upload to cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) =>{
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if(result){
                        resolve(result);
                    }else{
                        reject(error);
                    }
                })

                //Using streamifier to consvert the file buffer to a stream
                streamifier.createReadStream(fileBuffer).pipe(stream)

            })
        }

        //Calling the streamUpload function 
        const result = await streamUpload(req.file.buffer);

        //Responding according to file upload if success then msg success if fail then msg fail
        res.json({imageUrl : result.secure_url});


    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error!"})
    }
})



module.exports = router;