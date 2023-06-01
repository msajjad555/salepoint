const Banner = require("../models/bannerModel")

exports.deleteBanner=async(req,res)=>{
    const banner=await Banner.findByIdAndDelete(req.params.id)
    // console.log(banner);
        //we will add cloudinary
      
        // await banner.remove()
        res.status(200).json({
            success:true,
            message:'banner removed'
        })
    }