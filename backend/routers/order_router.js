const express = require('express')
const router = express.Router()
const Order = require('../models/order_model')
const Order_item = require('../models/order-item_model')

router.get('/order',async(req,res)=>{
    const orderList = await Order.find().populate('user','name').sort({'dateOrdered':-1})

    if(!orderList)
    return res.status(500).json({success:false})
})

router.get('/order/:id',async(req,res)=>{
    const order = await Order.findById(req.params,id)
    .populate('user','name')
    .populate({
        path:'orderItems',populate:{
            path:'product',populate:'category'
        }
    });
    if(!order){
        res.status(500).json({success:false})
    }
    res.json(order)

})


router.post('/order/post',async(req,res)=>{
    const orderItemsIds = Promise.all(req.body.Order_item.map(async(Order_item)=>{
        let newOrderItem = new Order_item({
            quantity:Order_item.qunatity,
            product:Order_item.product,

        })
        newOrderItem = await newOrderItem.save()

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async(OrderItemId)=>{
        const orderItem = await Order_item.findById(orderItemId).populate('product','price');
        const totalPrice = await Order_item.product.price*orderItem.qunatity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b)=>a+b,0)
    const order = new Order({
        orderItems:orderItemsIdsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice :totalPrice,
        user:req.body.user


    })

    order = await Order.save()
    if(order)
    return res.status(200).json({success:true,data:order})
})



module.exports = router