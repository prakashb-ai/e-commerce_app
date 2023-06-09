const express = require('express')
const router = express.Router()
const category = require('../models/categories_model')

router.post('/post/category',async(req,res)=>{
    const post_Data = new category({
        name:req.body.name,
        icon:req.body.icon,
        colour:req.body.colour
    })
    const save_data = await post_Data.save()
    if(save_data)
    return res.status(200).json({success:true,data:post_Data})
})

router.get('/category/all',async(req,res)=>{
    const find = await category.find()
    if(find)
    return res.status(200).json({message:"category was created",data:find})
})

router.put(`/update/:id`,async(req,res)=>{
    const update_data = await category.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        icon:req.body.icon,
        colour:req.body.colour
    },{new:true})
    if(update_data)
    return res.status(200).json({message:"updated data",data:updated_data})
})


router.delete('/category/delete/:id',async(req,res)=>{
    const delete_Data = await category.findOneAndDelete(req.params.id)
    if(delete_Data)
    return res.status(200).json({message:"category was deleted",data:delete_Data})
})

module.exports = router