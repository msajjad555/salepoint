const express=require("express");
const slugify=require('slugify')
const shortid=require('shortid')
const router=express.Router()
const multer=require ('multer');

const { category, getCategory, postCategory, getCategories, deleteCategories, updateCategories, getCategoryDetails, childCategory } =
 require("../controller/categoryController");

const Category = require("../models/Category");
// const { requireSignin } = require("../controllers/categoryController");
const upload=multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, 'uploads/category')
             
            },
        filename:(req,file,cb)=>{
            cb(null,file.originalname);
        },}),
        limits:{fileSize:30000}
    });
        // router.route("/category/create",upload.single("categoryImage")).post(postCategory)
        
        router.post('/admin/category/create',upload.single("categoryImage"),(req,res)=>{
            const categoryObj={
                name:req.body.name,
                slug:slugify(req.body.name),
           categoryImage:req.file.originalname
             
            }
            if(req.file){
                categoryObj.categoryImage=req.file.originalname;
                // categoryObj.categoryImage=process.env.API+'/uploads/category/'+req.file.filename;
    
            }
            if(req.body.parentId){
                categoryObj.parentId=req.body.parentId
            }
            const cat=new Category(categoryObj);
            cat.save((eror,category)=>{
                if(category){
                    return res.status(201).json({category})
                }
            })
        
        const createCategories=(categories,parentId=null)=>{
        let categoryList=[];
        let category;
        if(parentId===null){
            category=categories.filter(cat=>cat.parentId==undefined);
        }else{
            category=categories.filter(cat=>cat.parentId==parentId);
        }
        for(let cate of category){
            categoryList.push({
                _id:cate._id,
                name:cate.name,
                slug:cate.slug,
                categoryImage:cate.categoryImage,
                children:createCategories(categories, cate._id)
            })
        }
        return categoryList;
        }
        })
     


    //     router.post( "/category/update",  requireSignin,upload.array("categoryImage"),
    //     updateCategories
    //   );
    // //   superAdminMiddleware,
    //   router.post("/category/delete", requireSignin, deleteCategories);
    //   , superAdminMiddleware

router.route('/category/getcategory').get(getCategories)
router.route('/category/child').get(childCategory)
router.route('/category/:id').get(getCategoryDetails)
module.exports=router