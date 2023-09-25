const express = require('express')
const router = express.Router()
const {Position, validate} = require('../model/positionSchema')
const validId = require('../middleware/validId')
const isValidIdBody = require("../utils/isValidIdBody");
const {Media} = require("../model/mediaSchema");
const deleteMedias = require("../utils/deleteMedias");
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
    const {model}=req.query
    let position=null
    if (model){
     position = await Position.find({model})

    }else{
     position = await Position.find()
    }

    res.send(position)
})


router.get('/:id', validId, async (req, res) => {
    const position = await Position.findById(req.params.id)

    if (!position) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(position)
})


router.post('/', auth,async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody([req.body.mediaId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const Image = await Media.findById(req.body.mediaId)

    try {
        const position = await Position.create({
            model: req.body.model,
            name: req.body.name,
            info: req.body.info,
            price: req.body.price,
            includedList: req.body.includedList,
            image: Image
        })

        await position.save()

        res.status(201).send(position)
    } catch (error) {
        console.log(error)
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
    const ValidId = isValidIdBody([req.body.mediaId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const Image = await Media.findById(req.body.mediaId)
    try {
        const position = await Position.findByIdAndUpdate(req.params.id, {
            model: req.body.model,
            name: req.body.name,
            info: req.body.info,
            price: req.body.price,
            includedList: req.body.includedList,
            image: Image
        },{new:true})

        if (!position) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.status(200).send(position)
    } catch (error) {
        res.send(error.message)
    }
})

router.delete('/:id', [auth,validId], async (req, res) => {
    const position = await Position.findByIdAndRemove(req.params.id)

    if (!position) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    try {

        await Media.findByIdAndRemove(position.image._id)
        await deleteMedias([position.image])
        res.send(position)
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router
