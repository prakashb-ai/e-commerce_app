const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

app.use(cors({
    origin:'*'
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

const user_router = require('./routers/user_router');
const product_router = require('./routers/product_router')
const category_router = require('./routers/categories_router')
const order_router = require('./routers/order_router')

app.use(user_router)
app.use(product_router)
app.use(category_router)


mongoose.connect(process.env.DATABASE_STRING).
then(()=>{
    console.log('database connected to the server')
}).catch((err)=>{
    console.log(err)
})




app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})