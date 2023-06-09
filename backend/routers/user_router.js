const express = require('express')
const router = express.Router()
const User = require('../models/user_model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



router.get('/',async(req,res)=>{

    const userList = await User.find().select('email password')

    if(userList)
    return res.status(200).json({success:true,data:userList})
})

router.get('/:id',async(req,res)=>{
    const getData = await User.findById(req.params.id)

    if(getData)
    return res.status(200).json({success:true,data:getData})
})

router.post('/register',async(req,res)=>{
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country,
    })

    const save_data =await user.save()
    if(!save_data)
        return res.status(400).json({message:"the user cannot be created",})
    
    else
        return res.status(200).json({sucess:true,data:save_data})
    
})

router.post('/login',async(req,res)=>{
    const user = await User.findOne({email:req.body.email})
    const secret = process.env.secret
    if(!user)
    return res.status(400).json({success:false})

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId:user.id,
                isAdmin:user.isAdmin
            },
            secret,
            {
                expiresIn:"1d"
            }
        )
        res.status(200).json({user:user.email,token:token})
    }
})

router.put('/:id',async(req,res)=>{
    const update_data = await User.findById(req.params.id)
    let newPassword

    if(req.body.password){
        
        newPassword = bcrypt.hashSync(req.body.password,10)
    }
    else{
        newPassword = update_data.passwordHash
    }

    const update = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:newPassword,
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        country:req.body.country

    })

    const updateData= await update.save()

    if(updateData)
    return res.status(200).json({success:true,data:updateData})
})

router.get('/count',async(req,res)=>{
    const countDocument = await User.countDocuments((count=>count))
    if(!countDocument){
        return res.status(400).json({success:false})
    }
    res.json({
        data: countDocument
    });

})


router.delete('/delete/:id',async(req,res)=>{
    const delete_data = User.findByIdAndDelete(req.params.id)
    if(delete_data)
    return res.status(200).json({success:true,data:delete_data})
})

module.exports = router