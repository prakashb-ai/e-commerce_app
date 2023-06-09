const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    orderItems:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'orderItem',
        reuqired:true
    },
    shippingAddress1:{
        type:String,
        required:true,
    },
    shippingAddress2:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'pending',
    },
    totalPrice:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    dateOrdered:{
        type:Date.now(),
        required:true
    }

},{
    timestamps:true
})

OrderSchema.virtual('id').get(function (){
    return this._id.toHexString()
}),

Order.Schema.set('toJSON',{
    virtuals:true
})

module.exports = mongoose.model('order',OrderSchema);