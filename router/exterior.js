const express = require('express')
const router = express.Router()
const {Exterior, validate} = require('../model/exteriorSchema')
const validId = require('../middleware/validId')
const isValidIdBody = require("../utils/isValidIdBody");
const {Media} = require("../model/mediaSchema");
const deleteMedias = require("../utils/deleteMedias");
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
    const {model, position} = req.query
    let exterior=null
    if (model || position){
         exterior = await Exterior.find({model,position})
    }else {
        exterior = await Exterior.find()
    }

    res.send(exterior)
})


router.get('/:id', validId, async (req, res) => {
    const exterior = await Exterior.findById(req.params.id)

    if (!exterior) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(exterior)
})


router.post('/', auth,async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody([req.body.colorMediaId, req.body.mediaId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const Image = await Media.findById(req.body.mediaId)
    const ColorImage = await Media.findById(req.body.colorMediaId)
    try {
        const exterior = await Exterior.create({
            model: req.body.model,
            position: req.body.position,
            name: req.body.name,
            price: req.body.price,
            image: Image,
            colorImage: ColorImage,
            commentPrice: req.body.commentPrice
        })
        await exterior.save()
        res.status(201).send(exterior)
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

router.put('/:id', validId, async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody([req.body.colorMediaId, req.body.mediaId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const Image = await Media.findById(req.body.mediaId)
    const ColorImage = await Media.findById(req.body.colorMediaId)
    try {
        const exterior = await Exterior.findByIdAndUpdate(req.params.id, {
            model: req.body.model,
            position: req.body.position,
            name: req.body.name,
            price: req.body.price,
            image: Image,
            colorImage: ColorImage,
            commentPrice: req.body.commentPrice
        }, {new: true})
        if (!exterior) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.status(200).send(exterior)
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

router.delete('/:id', validId, async (req, res) => {
    const exterior = await Exterior.findByIdAndRemove(req.params.id)

    if (!exterior) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }
    const imagesId = [exterior.image._id, exterior.colorImage._id]
    try {

        await Media.deleteMany({_id: {$in: imagesId}})
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                res.send(error.message)
            });
        await deleteMedias([exterior.image, exterior.colorImage])
        res.send(exterior)
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router
