const express = require('express')
const router = express.Router()
const Product = require('../models/product_model')
const Category = require('../models/categories_model')
const multer = require('multer')
const mongoose = require('mongoose')

const FILE_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
};

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('invalid image type')
        if(isValid){
            uploadError=null
        }
        cb(uploadError,'public/uploads')
    },
    filename: function(req,file,cb){
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null,`${fileName}-${Date.now()}.${extension}`)
    },
});

const uploadOptions = multer({storage:storage});

router.post('/product/post',uploadOptions.single('image'),async(req,res)=>{

    const category = await Category.findById(req.body.category)

    if(!category)
    return res.status(400).json({message:"invalid category"})

    const file = req.file
    if(!file)
    return res.status(400).json({message:"No image is request"})

    const fileName = file.filename
    const basePath =`http://localhost:${process.env.PORT}/public/uploads/`

    const product = new Product({
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:`${basePath}${fileName}`,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReview:req.body.numReview,
        isfeatured:req.body.isfeatured,

    })

    const save_details = await product.save()
    if(save_details)
    return res.status(200).json({message:"created items",data:save_details})
})



router.put('/product/update/:id',uploadOptions.single('image'),async(req,res)=>{
    
    if(mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({message:"invalid product id"})
    }

    const product = await Product.findById(req.params.id)
    if(!product)
    return res.status(400).json({message:"invalid product"})

    const category = await Category.findById(req.params.id)
    if(!category)
    return res.status(400).json({message:"invalid categiry"})

    const file = req.file
    let imagepath
    

    if(file){
    const fileName = file.filename;
    const basepath = `http://localhost:${process.env.PORT}/public/uploads/`
    imagepath=`${basepath}${fileName}`
    }
    else{
        imagepath=product.image
    }

    const updated_product = await Product.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:imagepath,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReview:req.body.numReview,
        isfeatured:req.body.isfeatured,

    },
    {new:true}
    );
    const save = await updated_product.save()
    if(save)
    return res.status(200).json({message:"updated",data:save})
    
})

router.get('/product/get/:id',async(req,res)=>{
    const get = await Product.findById(req.params.id).populate('category')
    if(get){
        return res.status(200).json({success:true,data:get})
    }
})

router.delete('/product/delete/:id',async(req,res)=>{
    const delete_product = await Product.findByIdAndDelete(req.params.id)
    if(delete_product)
    return res.status(200).json({message:"deleted product",data:delete_product})
})


router.get('/product/get/featured/:count',async(req,res)=>{
    const count = req.params.count?req.params.count:0;
    const product = await Product.find({isfeatured:true}).limit(+count)
    if(product)
    return res.status(200).json({success:true,data:product})
})

router.get('/product/get/count',async(req,res)=>{
    const count = await Product.countDocuments((count)=>count)
    if(count){
        return res.status(200).json({success:true,data:count})
    }
})

router.put('/product/gallery-images/:id',uploadOptions.array('images',10),async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params).id){
        return res.status(400).json({message:"invalid object id"})
    }
    const files = req.files
    let imagepaths=[]
    const basepath=`http:localhost:${process.env.PORT}/public/uploads`

    if(files){
        files.map((file)=>{
            imagepaths.push(`${basepath}${file.filename}`)
        });
    }
    const product = await Product.findByIdAndUpdate(req.params.id,{
        image:imagepaths,
    },
    {new:true}
    
    );
    if(product){
        return res.status(200).json({message:"updated images"})
    }
})

module.exports = router