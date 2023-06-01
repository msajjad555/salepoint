const express=require("express");
const router=express.Router()
const shortid = require('shortid');
const slugify=require('slugify')
const {getAllProducts,getFilterProducts,createProduct, updateProduct, deleteProduct, getProductsDetails, createProductReviews, getProductReviews,
     deleteReview,getAdminProducts, UploadProduct, getProducts, pro, productUpload}=require('../controller/productController');
const {auth,isAuthenticatedUser,authorizeRoles}=require('../middleware/auth')
const multer=require ('multer');
const mongoose=require('mongoose')
const Product=require ('../models/productsModel')
router.route('/products').get(getAllProducts);
// router.route('/getfilterproducts').get(getFilterProducts);
router.route('/admin/product/:id').put(updateProduct).delete(deleteProduct)
router.route('/product/:id').get(getProductsDetails)
router.route("/admin/products").get(auth,authorizeRoles("admin"),getAdminProducts);
router.route('/reviews').get(getProductReviews)
router.route('/reviews').delete(auth,deleteReview).put(auth,createProductReviews)
router.route("/products").get(getAllProducts);
//multer
const upload=multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, 'uploads/products/')
             
            },
        filename:(req,file,cb)=>{
            cb(null,file.originalname);
        },}),
        limits:{fileSize:500000}
    });
        //admin route
        router.post('/admin/product/create',auth,upload.array('productPictures'),
        async(req,res)=>{
        //   console.log({file:req.files,body:req.body})
       
        const{name,price,description,category,stock,discount,weight,size,color,address,user}=req.body;
        let productPictures=[];
        if (req.files.length>0){
            productPictures=req.files.map(file=>{
 
                return{img:file.filename }         
                
            })
        }
        const originalPrice=Math.round((price)-(price*discount/100))
        
        const product=new Product({
            name:name,
            // user:req.user._id,
            slug:slugify(name),
            price,
            stock,
            description,
            productPictures,
            category,address,
            discount,weight,size,color,originalPrice
        })
const products=await product.save()

res.json({products
})
        })
   

module.exports=router


