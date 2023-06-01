
 const Product=require('../models/productsModel')
const ErrorHandler = require('../utils/errorhander')
const catchAsyncErrors=require('../middleware/catchAsyncErrors')
const ApiFeatures=require('../utils/apifeatures');
const Category=require ('../models/Category')
const multer=require ('multer');
const upload=multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, 'uploads') 
             
            },
        filename:(req,file,cb)=>{
            cb(null,file.originalname);
        },})});
//get all products
// exports.getFilterProducts=catchAsyncErrors(async(req,res,next)=>{
//     const products=await Product.find({})

    

//         res.status(200).json({success:true,products})
   
//     })


exports.getAllProducts=async(req,res,next)=>{
    try {
        const resultPerPage=20;
    const productsCount = await Product.countDocuments();
let products=await Product.find({ })
   const apiFeature=new ApiFeatures(Product.find({}),req.query)
   .search()
   .filter()
   .pagination(resultPerPage)
   let filteredProductsCount=products.length;
       apiFeature.pagination(resultPerPage)
   
   products=await apiFeature.query
     .sort({createdAt:-1})
        .populate('category')
        // .populate('user')
        
 
        .exec()
        // .limit(pageSize)
            res.json({products,productsCount,resultPerPage,filteredProductsCount})
    }
        
    catch (error) {
        console.log(error);
        
    }}
    exports.productUpload=catchAsyncErrors(upload.array('productPictures'),async(req,res,next)=>{
try {
    const{name,price,description,category,stock,discount,weight,size,color}=req.body;
    let productPictures=[];
    if (req.files.length>0){
        productPictures=req.files.map(file=>{
// req.files.forEach(element => {
//             img:element.filename
            return{img:file.filename }         
            
        })
    }
    const originalPrice=Math.round((price)-(price*discount/100))
    const products=new Product({
        name:name,
        slug:slugify(name),
        price,
        stock,
        description,
        productPictures,
        category,user,
        discount,weight,size,color,originalPrice
    })
await products.save()
res.json({products})
    }
    
 catch (error) {
    console.log(error);
}
})
  
       


//update by id
exports.updateProduct=catchAsyncErrors(async(req,res,next)=>{
    let product=await Product.findById(req.params.id)
    if(!product){
        return res.json({message:'no product found'})
    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({
        success:true,product
    })
})
exports.deleteProduct=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findByIdAndDelete(req.params.id)
    if(!product){
        return res.json({message:'no product found'})
    }
//    await Product.remove({_id:req.params.ids})
    res.status(200).json({
        success:true,message:'product deleted',product
      
    })
})
exports.getProductsDetails=async(req,res,next)=>{
    const product=await Product.findById(req.params.id)
    // .sort(-1)
if(!product){
    return next(new ErrorHandler('product not found',404))
}
   
    res.status(200).json({
        success:true,product
    })

}

exports.createProductReviews=async(req,res,next)=>{
    const {rating,comment,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }
    const product=await Product.findById(productId)
    const isReviewed=product.reviews.find(
        (rev)=>rev.user.toString()===req.user._id.toString()
    )
    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString())
            (rev.rating=rating),(rev.comment=comment)
        })
    }else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length

    }
    let avg=0;
  product.reviews.forEach(rev=>{
        avg+=rev.rating
    })
product.rating/product.reviews.length
    await product.save({
        validateBeforeSave:false
    })
    res.status(200).json({

         success:true
    })
}
//get all reviews of a product
exports.getProductReviews=async(req,res,next)=>{
    const product=await Product.findById(req.query.id)
    if(!product){
        return next('product not found')
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews,
    })
}
// delete review
exports.deleteReview=async(req,res,next)=>{
    const product=await Product.findById(req.query.productId)
    if(!product){
        return next('product not found')
    }
    const reviews=product.reviews.filter(
        (rev)=>rev._id.toString()!==req.query.id.toString()

    )
    let avg=0;
    reviews.forEach((rev)=>{
        avg==rev.rating
    })
    const ratings=avg/reviews.length;
    await product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{
new:true,
runValidator:true,
useFindAndModify:false,
    })
    res.status(200).json({
        success:true
    })
}
// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });
