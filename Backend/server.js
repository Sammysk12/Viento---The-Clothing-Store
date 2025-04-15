const express = require('express');
//for cross functioning of the servers react and node
const cors = require('cors');

//to provide the port number from .env file
const dotenv = require('dotenv')

//MongoDB connect file
const connectDB = require('./Config/db');



const app = express();

//Built-in middleware to parse data in json
app.use(express.json());

//to Communicate with cross origin (with react server)   there are 2 different ports are running one is for react application and other is this express server
app.use(cors());


//for user routes
const userRoutes = require('./Routes/userRoutes')
const productRoutes = require('./Routes/productRoutes')
const cartRoutes = require('./Routes/cartRoutes')
const checkoutRoutes = require('./Routes/checkoutRoutes')
const orderRoutes = require('./Routes/orderRoutes')
const uploadRoutes = require('./Routes/uploadRoutes')
const subscribeRoutes = require('./Routes/subscribeRoutes')

//Admin route
const adminRoutes = require('./Routes/Admin_Routes/adminRoutes')
const productAdminRoutes = require('./Routes/Admin_Routes/productAdminRoutes')
const orderAdminRoutes = require('./Routes/Admin_Routes/orderAdminRoutes')


//to config (read file) from the env file
dotenv.config();
const PORT = process.env.PORT || 3000;


//connect function of mongoDB
connectDB();


app.get('/',(req, res) =>{
    res.send("Hello from the server!")
});


//API routes
app.use('/api/users' , userRoutes)
app.use('/api/products' , productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/subscribe', subscribeRoutes)


//Admin routes
app.use('/api/admin', adminRoutes)
app.use('/api/admin/products', productAdminRoutes)
app.use('/api/admin/orders', orderAdminRoutes)

app.listen(PORT, () =>console.log(`Server started at  http://localhost:${PORT}`))