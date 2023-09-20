const express = require('express')
const router = express.Router()
const {Option, validate} = require('../model/optionSchema')
const validId = require('../middleware/validId')
const isValidIdBody = require("../utils/isValidIdBody");
const {Media} = require("../model/mediaSchema");
const deleteMedias = require("../utils/deleteMedias");
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
    const {model,position,exterior,interior}=req.query
    let option=null
     option = await Option.find()

    if (model || position || exterior||interior){
        option = await Option.find({model,position,exterior,interior})
    }else {
        option = await Option.find()
    }

    res.send(option)
})


router.get('/:id', validId, async (req, res) => {
    const option = await Option.findById(req.params.id)

    if (!option) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(option)
})


router.post('/', async (req, res) => {

    let includes=[]

    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody([req.body.mainMediaId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const Image = await Media.findById(req.body.mainMediaId)

    if (req.body.includes.length>0){
        for (let i=0;i<req.body.includes.length;i++){
            let image={
                path:"null",
                name:"null"
            }
            if (req.body.includes[i].mediaId!==""){
                image=await Media.findById(req.body.includes[i].mediaId)
            }
            const includesObj={
                title:req.body.includes[i]?.title,
                comment:req.body.includes[i]?.comment,
                tags:req.body.includes[i]?.tags,
                image
            }
            includes.push(includesObj)
        }
        req.body.includes.map( async (item)=>{

        })
    }

    try {
        const option = await Option.create({
            model: req.body.model,
            position:req.body.position,
            exterior:req.body.exterior,
            interior:req.body.interior,
            name: req.body.name,
            price: req.body.price,
            bonus: req.body.bonus,
            includeComment: req.body.includeComment,
            mainImage: Image,
            includes
        })

        res.status(201).send(option)
    } catch (error) {

        res.send(error.message)
    }
})

router.put('/:id', validId, async (req, res) => {

    let includes=[]

    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody([req.body.mainMediaId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const Image = await Media.findById(req.body.mainMediaId)

    if (req.body.includes.length>0){
        for (let i=0;i<req.body.includes.length;i++){
            let image={
                path:"null",
                name:"null"
            }
            if (req.body.includes[i].mediaId!==""){
                image=await Media.findById(req.body.includes[i].mediaId)
            }
            const includesObj={
                title:req.body.includes[i]?.title,
                comment:req.body.includes[i]?.comment,
                tags:req.body.includes[i]?.tags,
                image
            }
            includes.push(includesObj)
        }
        req.body.includes.map( async (item)=>{

        })
    }
    try {
        const option = await Option.findByIdAndUpdate(req.params.id, {
            model: req.body.model,
            position:req.body.position,
            exterior:req.body.exterior,
            interior:req.body.interior,
            name: req.body.name,
            price: req.body.price,
            bonus: req.body.bonus,
            includeComment: req.body.includeComment,
            mainMediaId: Image,
            includes
        },{new:true})
        if (!option) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.status(200).send(option)
    } catch (error) {
        res.send(error.message)
    }
})

router.delete('/:id', validId, async (req, res) => {
    const option = await Option.findByIdAndRemove(req.params.id)

    if (!option) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }
    const imagesId = [option.mainImage._id]
    const imagesIdFile = [option.mainImage]
    option.includes.map((item)=>{
        if (item.image!==""){
            imagesId.push(item.image._id)
            imagesIdFile.push(item.image)
        }
    })
    try {

        await Media.deleteMany({_id: {$in: imagesId}})
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                res.send(error.message)
            });
        await deleteMedias(imagesIdFile)
        res.send(option)
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router
