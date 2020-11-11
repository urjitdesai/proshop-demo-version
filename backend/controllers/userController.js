const User= require('../models/userModel')
const expressAsyncHandler= require('express-async-handler')
const generateToken= require("../utils/generateToken")

// USER AUTHENCTICATION FOR LOGIN
const authUser= expressAsyncHandler(async (req, res) => {
    const {email, password}= req.body
    
    const user= await User.findOne({email})
    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error("Invalid email or password")
    }
})

//GET USER PROFILE
const getUserProfile= expressAsyncHandler(async (req, res) => {
    //console.log("getUserProfile controller called");
    const user= await User.findById(req.user._id)
    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

// UPDATE USER PROFILE
const updateUserProfile= expressAsyncHandler(async (req, res) => {
    const user= await User.findById(req.user._id)
    if(user){
        user.name= req.body.name || user.name
        user.email= req.body.email || user.email
        if(req.body.password){
            user.password= req.body.password
        }
        const updatedUser= await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)  
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

// REGUSTER A NEW USER
const registerUser= expressAsyncHandler(async (req, res) => {
    
    const {name, email, password}= req.body
    const userExists= await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    } 

    const user= await User.create({
        name,
        email,
        password
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})

//GET USERS FOR ADMIN
const getUsers= expressAsyncHandler(async (req, res) => {
    const users= await User.find({})
    res.json(users)
})

// DELTE USER BY ADMIN
const deleteUser= expressAsyncHandler(async (req, res) => {
    const user= await User.findById(req.params.id)

    if(user){
        await user.remove()
        res.json({message: "User removed"})
    } else {
        res.status(401)
        throw new Error("User not found")
    }
})

// GET USER BY ID
const getUserById= expressAsyncHandler(async (req, res) => {
    const user= await User.findById(req.params.id).select('-password')

    if(user){
        res.json(user)
    } else {
        res.status(401)
        throw new Error("User not found")
    }
})

// UPDATE USER BY ADMIN
const updateUser= expressAsyncHandler(async (req, res) => {
    
    const user= await User.findById(req.params.id)

    if(user){
        user.name= req.body.name || user.name
        user.email= req.body.email || user.email
        // user.isAdmin=req.body.isAdmin

        const updatedUser= await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(401)
        throw new Error("User not found")
    }
})

module.exports= {authUser, updateUser, getUserById, deleteUser, getUsers, updateUserProfile, getUserProfile, registerUser}