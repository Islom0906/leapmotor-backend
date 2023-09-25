const express = require('express')
const router = express.Router()
const {Interior, validate} = require('../model/interiorSchema')
const validId = require('../middleware/validId')
const isValidIdBody = require("../utils/isValidIdBody");
const {Media} = require("../model/mediaSchema");
const deleteMedias = require("../utils/deleteMedias");
const auth = require('../middleware/auth')



router.get('/', async (req, res) => {
    let {model,position,exterior}=req.query
    let interior
    if (model || position || exterior){
        interior = await Interior.find({model,position,exterior})
    }else {
        interior = await Interior.find()
    }
    res.send(interior)
})



router.get('/:id', validId, async (req, res) => {
    const interior = await Interior.findById(req.params.id)

    if (!interior) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(interior)
})


router.post('/', auth,async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody([req.body.colorMediaId,req.body.mediaId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const Image = await Media.findById(req.body.mediaId)
    const ColorImage = await Media.findById(req.body.colorMediaId)
    try {
        const interior = await Interior.create({
            model: req.body.model,
            position:req.body.position,
            exterior:req.body.exterior,
            name: req.body.name,
            price: req.body.price,
            image: Image,
            colorImage:ColorImage,
        })

        await interior.save()
        res.status(201).send(interior)
    } catch (error) {
        if (error.code === 11000) {
            // MongoDB duplicate key error (code 11000)
            res.status(400).json({ error: 'Duplicate key error' });
        }  else {
            // Handle other errors here
            res.send(error.message)
        }
    }
})

router.put('/:id', [auth,validId], async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody([req.body.colorMediaId,req.body.mediaId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const Image = await Media.findById(req.body.mediaId)
    const ColorImage = await Media.findById(req.body.colorMediaId)
    try {
        const interior = await Interior.findByIdAndUpdate(req.params.id, {
            model: req.body.model,
            position:req.body.position,
            exterior:req.body.exterior,
            name: req.body.name,
            price: req.body.price,
            image: Image,
            colorImage:ColorImage,
        },{new:true})


        if (!interior) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.status(200).send(interior)
    } catch (error) {
        res.send(error.message)
    }
})

router.delete('/:id', [auth,validId], async (req, res) => {
    const interior = await Interior.findByIdAndRemove(req.params.id)

    if (!interior) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }
    const imagesId = [interior.image._id,interior.colorImage._id]
    try {

        await Media.deleteMany({_id: {$in: imagesId}})
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                res.send(error.message)
            });
        await deleteMedias([interior.image,interior.colorImage])
        res.send(interior)
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router
