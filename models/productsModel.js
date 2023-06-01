const mongoose = require('mongoose');
const productSchema = mongoose.Schema({  
        // id:{type:String},
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
    feature:{
        type:String,
        default:false,
    },

    size:{
        type:Number
    },
    weight:{
        type:Number
    },
    color:{
        type:String
    },
    discount:{
        type:Number,
    },
    stock:{
        type:Number,
        // required:true,
    },
    price: { 
        type: Number, 
        required: true 
    },

    description: {
        type: String,
        required: true,
        trim: true
    },
    originalPrice:{
        type:Number,
     
    },
    offer: { type: Number,
    default:false
    },
    productPictures: [
        { img: { type: String,
        required:true
        },
        
    
 }
    ],
    ratings: {
            type: Number,
            default: 0
          },
    reviews: [
        {
            userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            review: String
        }
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category',required:true },

   
    updatedAt: Date,
    createdAt: {
            type: Date,
            default: Date.now,
          },

}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);