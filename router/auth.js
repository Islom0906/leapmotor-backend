const express=require('express')
const router=express.Router()
const {User} =require('../model/userSchema')

const bcrypt = require("bcrypt");
const Joi = require("joi");


router.post('/', async (req,res)=>{
    const {error}=validate(req.body)

    if (error){
        return res.status(400).send(error.details[0].message)
    }

    let user=await User.findOne({email:req.body.email})

    if (!user){
        return res.status(400).send('Email yoki parol xato ')
    }

    const isValidPassword=await bcrypt.compare(req.body.password,user.password)
    if (!isValidPassword){
        return res.status(400).send('Email yoki parol xato ')
    }

    const token=user.generateAuthToken(user)

    res.send({'token': token})
})

function validate(req){
    const userValid=Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().required()
    })

    return userValid.validate(req)
}

module.exports=router