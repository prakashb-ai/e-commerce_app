const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    richDescription:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    images:[{
        type:String,
        required:true
    }],
    brand:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
    },
    countInStock:{
        type:Number,
        required:true,
        min:0,
        max:255,
    },
    rating:{
        type:Number,
        default:0
    },
    numReview:{
        type:Number,
        required:true
    },
    isfeatured:{
        type:Boolean,
        required:true
    },
    
},{
    timestamps:true
})

ProductSchema.virtual('id').get(function (){
    return this._id.toHexString()
}),

ProductSchema.set('toJSON',{
    virtuals:true
})



module.exports = mongoose.model('product',ProductSchema)