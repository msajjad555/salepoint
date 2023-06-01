const express=require("express");
const router=express.Router();
const { user,getAllUser, loginUser, logout, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser, registerUser, requireSignin, loginUserNew, updateUserProfile } = require("../controller/userController");
const {auth,isAuthenticatedUser,authorizeRoles}=require('../middleware/auth')
const User=require ('../models/userSchema')
const multer=require('multer')
const {createProductReviews}=require('../controller/productController')
//user routes
router.route('/signin').post(loginUserNew)
router.route('/logout').get(logout)
router.route('/me').get(auth,getUserDetails).put(auth,updateProfile)
router.route('/password/update').put(auth,updatePassword)
router.route('/admin/users/:id').get(getSingleUser)
.put(auth,authorizeRoles('admin'),updateUserRole)
.delete(deleteUser)
router.route('/review').put(auth,createProductReviews)
router.route("/admin/users").get(getAllUser);
const generateAuthToken = require('../controller/generateToken');

 //user routes
 const upload=multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, 'uploads/userprofile/')
             
            },
        filename:(req,file,cb)=>{
            cb(null,file.originalname);
        },})});
 router.post('/user/create',upload.single('userProfile'),
 async(req,res)=>{
 //   console.log({file:req.file,name:req.body.name})
 const{name,email,password,phoneNumber,userName,address}=req.body;
 //this name(userprofile) must match with schema name
 const userProfile=req.file.originalname
 const user=new User({
     address,name,email,password,phoneNumber,userName,userProfile
 });
 
const {_id:id,active,role}=user
if(!active){
    return res.status(404).json({message:'not authorized'})
}
 await user.save()    
 const token=generateAuthToken(user._id)
 res.status(201).json({
token,
user,id,active,role

 })

 })
 router.patch('/update/:userId',async(req,res)=>{
    const {role,active}=req.body
    await User.findByIdAndUpdate(req.params.userId,{role,active})
  res.status(200).json({success:true,result:{_id:req.params.userId}})

 })


//  router.put('/me',async(req,res,next)=>{
//      const {user}=await User.findByIdAndUpdate(req.user._id)
//      if(user){
//          user.name=req.body.name || user.name
//          user.email=req.body.email || user.email
//          user.phonenumber=req.body.phonenumber || user.phonenumber
//          user.userProfile=req.file.originalname || user.userProfile
      
//          if(req.body.password){
//              user.password=req.body.password
//          }
//          const updateUser=await user.save()
//          res.json({
//              _id:updateUser._id,
//              name:updateUser.name,
//          email:updateUser.email,
//          phonenumber:updateUser.phonenumber,
//          userProfile:updateUser.updateProfile,
//      token:generateAuthToken(updateUser._id)        })
//      }else{
//          res.status(404)
//      }
 
//    })

module.exports=router