const express=require("express");
const router=express.Router()
const multer=require ('multer');
const Banner = require("../models/bannerModel");
const {auth,isAuthenticatedUser,authorizeRoles}=require('../middleware/auth');
const { deleteBanner } = require("../controller/bannerController");
router.route('/banner/delete/:id').delete(deleteBanner)
const upload=multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
if(file.mimetype==='image/png'||
file.mimetype==='image/jpg'||
file.mimetype==='image/jpeg'
){cb(null, 'uploads/banner')}
else{
  cb(null,false);
  return cb(new error('only .png, .jpg, and .jpeg files are allowed'))}},
 
        filename:(req,file,cb)=>{
            cb(null,file.originalname);
        },}),
        limits:{fileSize:1000000}
      });
        router.post("/admin/add/banner",upload.single("file"),async (req,res)=>{
          res.send("file uploaded")
          const img= new Banner({
            file:req.file.originalname,
            name:req.body.name,
          })
          await img.save();
        })
        router.get('/banner',async(req,res)=>{
const banner=await Banner.find({}).limit(5).sort({createdAt:-1})
res.json({banner})
        })
        module.exports=router