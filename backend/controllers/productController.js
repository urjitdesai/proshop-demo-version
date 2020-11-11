const Product= require('../models/productModel')
const expressAsyncHandler= require('express-async-handler')

// const getProducts= expressAsyncHandler(async (req, res) => {
    
//     const pageSize=3
//     const page= Number(req.query.pageNumber) || 1
//     const keyword= req.query.keyword ? {
//         name: {
//             $regex: req.query.keyword,
//             $options: 'i'
//         }
//     } : {}

//     const count= await Product.countDocuments({...keyword})
//     const products= await Product.find({...keyword}).limit(pageSize).skip(pageSize* (page-1))
//     console.log(products);
//     res.json({products, page, pages: Math.ceil(count / pageSize)})
// })

const getProducts = expressAsyncHandler(async (req, res) => {
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1
  
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {}
  
    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
  
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  })


// GET PRODUCT BY ID
const getProductById= expressAsyncHandler(async (req, res) => {
    const product= await Product.findById(req.params.id)
    if(product){
        res.json(product)
    }else{
        res.status(404)
        throw new Error("Product not found")
    }
})

// DELETE PRODUCT BY ID
const deleteProduct= expressAsyncHandler(async (req, res) => {
    const product= await Product.findById(req.params.id)
    if(product){
        await product.remove()
        res.json({message: "Product removed"})
    }else{
        res.status(404)
        throw new Error("Product not found")
    }
})

// CREATE A NEW PRODUCT
const createProduct= expressAsyncHandler(async (req, res) => {
    const product= new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: "Sample description"
    })

    const createdProduct= await product.save()
    res.status(201).json(createdProduct)
})


// UPDATE PRODUCT
const updateProduct= expressAsyncHandler(async (req, res) => {
    
    const {name, price, description, image, brand, category, countInStock} =req.body

    const product= await Product.findById(req.params.id)
    if(product){
        product.name= name
        product.price= price
        product.description= description
        product.image= image
        product.brand= brand
        product.category= category
        product.countInStock= countInStock
        
        const updatedProduct= await product.save()
        res.status(201).json(updatedProduct)
    } else {
        res.status(404)
        throw new Error("Product not found")
    }
    
})


// ADD REVIEW
const createProductReview= expressAsyncHandler(async (req, res) => {
    
    const {rating, comment} =req.body

    const product= await Product.findById(req.params.id)
    if(product){
        const alreadyReviewed= product.reviews.find(r => r.user.toString() === req.user._id.toString())

        if(alreadyReviewed){
            res.status(400)
            throw new Error("Product already reviewed")
        }

        const review={
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)
        product.numReviews= product.reviews.length
        product.rating= product.reviews.reduce((acc, item) => item.rating+acc, 0)/ product.reviews.length

        await product.save()
        res.status(201).json({message: "review added"})
    } else {
        res.status(404)
        throw new Error("Product not found")
    }
    
})


// GET TOP RATED PRODUCTS
const getTopProducts= expressAsyncHandler(async (req, res) => {
    const products= await Product.find({}).sort({rating: -1}).limit(3)
    res.json(products)
})

module.exports= {getProductById, getTopProducts, updateProduct, createProductReview, createProduct, deleteProduct, getProducts}