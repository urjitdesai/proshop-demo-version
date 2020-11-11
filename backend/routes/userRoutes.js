const express=require('express')
const router= express.Router()
const {protect, admin}= require("../middleware/authMiddleware")

const {authUser, getUsers, getUserProfile, updateUser, registerUser, updateUserProfile, deleteUser, getUserById}= require("../controllers/userController")

// Authenticate User
router.post("/login", authUser)
router.route("/profile").get( protect,getUserProfile).put(protect, updateUserProfile)
router.route("/").post(registerUser)
router.route("/").get(protect, admin, getUsers)
router.route("/:id").delete(protect,admin, deleteUser)
                    .get(protect, admin, getUserById)
                    .put(protect, admin, updateUser)
module.exports= router