const express=require('express');
const Product=require('./models/productsModel')
const mongoose = require ('mongoose');
// const cors=require ('cors')
const slugify=require ('slugify')
const dotenv=require('dotenv')
const DB=require('./database/database')
const cloudinary=require ('cloudinary')
const productsRouter = require('./routes/productRoutes');
const categoryRoutes=require('./routes/categoryRoutes')
const bannerroutes=require('./routes/bannerRoutes')
const userRoutes=require('./routes/userRoutes')
const orderRoutes=require('./routes/orderRoutes')
const path=require('path')
const app=express()
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser');

// app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use('/uploads',express.static('uploads'))
// app.use('/check',express.static('check'))
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
// app.use(cors())

app.use(express.urlencoded({extended:true}))
app.use(categoryRoutes)
app.use(productsRouter)
app.use(orderRoutes)
app.use(userRoutes)
app.use(bannerroutes)
app.use(express.static(path.join(__dirname,"build")))
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,"build/index.html"))
})



dotenv.config({path:'config/config.env'})
DB();


const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
  });
