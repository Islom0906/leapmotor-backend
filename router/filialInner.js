const express = require('express')
const router = express.Router()
const {FilialInner, validate} = require('../model/filialInnerSchema')
const {Media} = require('../model/mediaSchema')
const validId = require('../middleware/validId')
const isValidIdBody = require("../utils/isValidIdBody");
const deleteMedias = require("../utils/deleteMedias");

// GET
router.get('/', async (req, res) => {
    const filialInner = await FilialInner.find()

    res.send(filialInner)
})


// POST
router.post('/', async (req, res) => {
    let images = []
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody(req.body.mediaId)
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    await Media.find({_id: {$in: req.body.mediaId}})
        .then((documents) => {
            images = documents
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message)
        });

    try {
        const filialInner = await FilialInner.create({
            images
        })
        res.status(201).send(filialInner)

    } catch (error) {
        res.send(error.message)
    }

})

//PUT

router.put('/:id', validId, async (req, res) => {
    let images = []
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody(req.body.mediaId)
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    await Media.find({_id: {$in: req.body.mediaId}})
        .then((documents) => {
            images = documents
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message)
        });
    try {
        const filialInner = await FilialInner.findByIdAndUpdate(req.params.id, {
            images
        }, {new: true})
        if (!filialInner) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.status(201).send(filialInner)

    } catch (error) {
        res.send(error.message)
    }

})

//DELETE

router.delete('/:id', validId, async (req, res) => {
    let imagesId = []

    const filialInner = await FilialInner.findByIdAndRemove(req.params.id)

    if (!filialInner) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    filialInner.images.forEach(image => {
        imagesId.push(image._id)
    })

    try {

        await Media.deleteMany({_id: {$in: imagesId}})
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                res.send(error.message)
            });
        await deleteMedias(filialInner.images)
        res.send(filialInner)
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router