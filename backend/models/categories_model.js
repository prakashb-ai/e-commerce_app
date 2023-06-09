const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        
    },
    colour:{
        type:String,
    }
},{
    timestamps:true
})

CategorySchema.virtual('id').get(function (){
    return this._id.toHexString()
}),

CategorySchema.set('toJSON',{
    virtuals:true
})

module.exports = mongoose.model('category',CategorySchema)
