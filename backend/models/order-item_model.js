const mongoose = require('mongoose')
const OrderItemSchema = new mongoose.Schema({
    quntatioy:{
        type:Number,
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        required:true
    },

},{
    timestamps:true
},

OrderItemSchema.virtual('id').get(function(){
    return this._id.toHexString()
}),

OrderItemSchema.set('toJSON',{
    virtuals:true
})

)

module.exports = mongoose.model('order-item',OrderItemSchema)