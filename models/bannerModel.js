const mongoose=require('mongoose')
const Banner=mongoose.Schema({
file:{
        type:String,
        required:true},

name:
        {type:String,
        // required:true
},
        createdAt:{

        },
        updatedAt: Date,
        createdAt: {
                type: Date,
                default: Date.now,
              },
});
module.exports=mongoose.model("Banner",Banner)