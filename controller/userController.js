const mongoose=require ('mongoose')
const express=require('express')
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User=require ('../models/userSchema')
const sendToken = require('../utils/jwtToken')
const cloudinary=require('cloudinary')
const ErrorHander=require ('../utils/errorhander')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const jwt=require('jsonwebtoken');
const generateAuthToken = require('./generateToken');
const multer=require ('multer');
const upload=require('../commen-middleware/com-middleware')


 //user routes
//  exports.registerUser,upload.single('userProfile'),
//  async(req,res)=>{
//  //   console.log({file:req.file,name:req.body.name})
// //  const{name,email,password,phonenumber,username,address}=req.body;
// //  //this name(userprofile) must match with schema name
// //  const userProfile=req.file.originalname
// //  const user=new User({
// //      address,name,email,password,phonenumber,username,userProfile
// //  })
 

//  await user.save()
//  // const token=user.getJWTToken();
 
//  const token=generateAuthToken(user._id)
//  res.status(201).json({
// token,
// user
//  })
// // sendToken(user,200,res)
//  }


exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHander("Please Enter Email & Password", 400));}
    const user = await User.findOne({ email })
   if(user && ( await user.comparePassword(password))){
    const options = {
        expires: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };


  res.status(200).cookie("token", options).json({
    _id:user._id,
    name:user.name,
    address:user.address,
    userName:user.userName,
    email:user.email,
    userProfile:user.userProfile,
    phoneNumber:user.phoneNumber,
    role:user.role,
    isAdmin:true,
    token:generateAuthToken(user._id)

    })
    // sendToken(user, 200, res);
  }
  else {
    return next(new ErrorHander("Invalid email or password", 401));
  }})


  exports.loginUserNew = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
    const options = {
        expires: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
  
    if (!email || !password) {
      return next(new ErrorHander("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHander("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHander("Invalid email or password", 401));
    }
  
    res.status(200).cookie("token", options).json({
        _id:user._id,
        name:user.name,
        address:user.address,
        userName:user.userName,
        email:user.email,
        userProfile:user.userProfile,
        phoneNumber:user.phoneNumber,
        role:user.role,
        isAdmin:true,
        token:generateAuthToken(user._id)
    
        })
  });

exports.logout=async(req,res,next)=>{

    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
   
    res.status(200).json({
        success:true,
        message:'logged out'
    })
}
exports.getUserDetails=async (req,res,next)=>{
    // console.log(req.user,'req body');
const user=await User.findById(req.user._id)
res.status(200).json({
    success:true,
    _id:user._id,
    name:user.name,
    email:user.email,
    userProfile:user.userProfile,
    phonenumber:user.phonenumber,
    role:user.role,
    userName:user.userName,
    isAdmin:true,
    user
})
// console.log(user,'user profile');
}
exports.updatePassword=async(req,res)=>{
    const user=await User.findById(req.user._id)
const isPasswordMatched=await user.comparePassword(req.body.oldpassword)
if(!isPasswordMatched){
    return next('invalid password')
}
user.password=req.body.newPassword;
await user.save()
    res.status(200).json({
    success:true,
    user,
})
}
exports.updateProfile=async(req,res)=>{
   
    const newUserData={
        name:req.body.name,
        address:req.body.address,
        userName:req.body.userName,
        phoneNumber:req.body.phoneNumber,
        email:req.body.email,
        role:req.body.role,
        // user:req.user._id
    }

    //we will add cloudinary
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    console.log(user),'user profile'
    console.log(newUserData);
    await user.save()
    console.log(user);
    res.status(200).json({ 
        success:true,
        // name,address,phoneNumber,email,userName
        user
})}
// exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
//     let user=await User.findByIdAndUpdate(req.user._id)
//     // console.log(user);
//     if(user){
//         user.name=req.body.name || user.name
//         user.email=req.body.email || user.email
//         user.address=req.body.adddress|| user.address
//         user.userName=req.body.userName|| user.userName
//         user.phoneNumber=req.body.phoneNumber|| user.phoneNumber
//     res.status(200).json({
//         _id:updateUser._id,
//         name:updateUser.name,
//         address:updateUser.address,
//         userName:updateUser.userName,
//         email:updateUser.email,
//         userProfile:updateUser.userProfile,
//         phoneNumber:updateUser.phoneNumber,
//         role:updateUser.role,
//         token:generateAuthToken(updateUser._id)
//     })
//     }  else{
//         res.status(400)
//     }
   
  
// } )
//get all users(admin)
exports.getAllUsers=async(req,res)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users
    })
}
//get single users(admin)
exports.getSingleUser=async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    // console.log(req.params.id,'user');
    if(!user){
        return next({message:`user does not exist with id:${req.params.id}`})
    }
    res.status(200).json({
        success:true,
        user
    })
}
//update user role--admin

//delete user ---admin
exports.deleteUser=async(req,res)=>{
const user=await User.findById(req.params.id)
    //we will add cloudinary
    if(!user){
        return next('user does not exist')
    }
    await user.remove()
    res.status(200).json({
        success:true,
    })
}

//update user ---admin
exports.updateUserRole=async(req,res)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }
    //we will add cloudinary
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    res.status(200).json({ 
        success:true,
    })
}
exports.requireSignin=(req,res,next)=>{
const token=req.headers.authorization.split(" ")[1];
const user=jwt.verify(token,process.env.JWT_SECRET)
req.user=user
next();

}
// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    });
  });
