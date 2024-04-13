const express=require('express')
const router=express.Router()
const {User,validate} =require('../model/userSchema')
const _ =require('lodash')
const bcrypt = require("bcrypt");
const auth=require('../middleware/auth')

router.get('/me',auth,async (req,res)=>{

    const user=await User.findById(req.user._id).select('-password')
    res.send(user)
})

router.get('/',auth,async (req,res)=>{

    const user=await User.find().select('-password')
    res.send(user)
})

router.post('/', auth,async (req,res)=>{
    const {error}=validate(req.body)

    if (error){
        return res.status(400).send(error.details[0].message)
    }

    let user=await User.findOne({email:req.body.email})

    if (user){
        return res.status(400).send('Bu email bilan ro\'yxatdan o\'tilgan' )
    }

    user= new User(req.body)
    const salt=await bcrypt.genSalt()
    user.password=await bcrypt.hash(user.password, salt)

    user=await user.save()

    res.send(_.pick(user,['_id','name','email','isAdmin']))
})






module.exports=router