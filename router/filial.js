const express = require('express')
const router = express.Router()
const {Filial, validate} = require('../model/filialSchema')
const {Media} = require('../model/mediaSchema')
const validId = require('../middleware/validId')
const isValidIdBody = require("../utils/isValidIdBody");
const deleteMedias = require("../utils/deleteMedias");

// GET
router.get('/', async (req, res) => {
    const filial = await Filial.find()

    res.send(filial)
})


// POST
router.post('/', async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody(req.body.mediaId)
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const image= await Media.findById(req.body.mediaId)
    if (!image){
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }
    try {
        const filial = await Filial.create({
            titleRu:req.body.titleRu,
            titleUz:req.body.titleUz,
            image

        })
        res.status(201).send(filial)

    } catch (error) {
        res.send(error.message)
    }

})

//PUT

router.put('/:id', validId, async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody(req.body.mediaId)
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const image= await Media.findById(req.body.mediaId)
    if (!image){
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }
    try {
        const filial = await Filial.findByIdAndUpdate(req.params.id,{
            titleRu:req.body.titleRu,
            titleUz:req.body.titleUz,
            image

        },{new:true})
        if (!filial) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.status(201).send(filial)

    } catch (error) {
        res.send(error.message)
    }

})

//DELETE

router.delete('/:id', validId, async (req, res) => {
    const filial = await Filial.findByIdAndRemove(req.params.id)

    if (!filial) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    try{

    await Media.findByIdAndRemove(filial.image._id)
    await deleteMedias([filial.image])
    res.send(filial)
    }catch (error){
        res.send(error.message)
    }
})

module.exports = router