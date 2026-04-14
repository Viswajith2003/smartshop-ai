const mongoose =require("mongoose")

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        minlength: [2, "Category name must be at least 2 characters long"], 
        maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description:{
        type:String,
        required:true,
        maxlength: [200, "Description cannot exceed 200 characters"], 
    },
    isActive:{
        type:Boolean,
        default:true,
    }

},{ timestamps: true })

module.exports=mongoose.model("Category",categorySchema)