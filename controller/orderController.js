const Product=require ('../models/productsModel')
const ErrorHander=require('../utils/errorhander')
const catchAsyncError=require('../middleware/catchAsyncErrors')
const Order=require('../models/orderSchema')
//create new order user
exports.newOrder=catchAsyncError(async(req,res,next)=>{
    try {
        const {shippingInfo,orderItems,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body// paymentInfo,
        const order=new Order({ shippingInfo,orderItems,  itemsPrice,taxPrice,shippingPrice,  totalPrice,
            name:req.user.name,userProfile:req.user.userProfile,
            paidAt:Date.now(),user:req.user._id,})
        const createOrder= await order.save()
        res.status(200).json({
            success:true,
            createOrder
        })
} catch (error) {
    console.log(error);
}

})
        
        
           
            
    // paymentInfo,
                
               
                
              
                
                
                
                // product:req.body._id,
           
// get single order
exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate('user','name email');
    if(!order){
        return next(new ErrorHander('order not found with id',404))
    }
    res.status(200).json({
        success:true,
        order
    })
    
})
// get logged in user
exports.myOrders=catchAsyncError(async(req,res,next)=>{
    const order=await Order.find({user:req.user._id})
    res.status(200).json({
        success:true,
        order
    })
    
})
//get all orders
exports.getAllOrders=catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find();
    let totalAmount=0;
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
    
})
// update order status

exports.updateOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
  if(order.orderStatus==='Delivered'){
    return next(new ErrorHander('you have already delivered this item',404))
  }
order.orderItems.forEach(async(order)=>{
     await updateStock(order.quantity)
}
)
  order.orderStatus===req.body.status;
  if(req.body.status==='Shipped'){
    order.deliveredAt=Date.now();
  }
  await order.save({
    validateBeforeSave:flase,
  })
    res.status(200).json({
        success:true,
        order
        // totalAmount,
       })
  
  });

    
  
 
    //delete order--admin
exports.deleteOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);

 
    if(!order){
        return next(new ErrorHander('order not found with id',404))
    } 
    await order.remove()
    res.status(200).json({
        success:true,
        // totalAmount,
        
    })
})

