const express = require('express')
const router = express.Router()
const {Product, validate} = require('../model/productSchema')
const {Media} = require('../model/mediaSchema')
const validId = require('../middleware/validId')
const isValidIdBody = require("../utils/isValidIdBody");
const deleteMedias = require("../utils/deleteMedias");
const auth=require('../middleware/auth')

// GET
router.get('/', async (req, res) => {
    const product = await Product.find().sort({createdAt:-1})

    res.send(product)
})


// POST
router.post('/', auth,async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody([req.body.mediaLogoId,req.body.mediaBannerId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const imageLogo= await Media.findById(req.body.mediaLogoId)
    const imageBanner= await Media.findById(req.body.mediaBannerId)

    if (!imageLogo || !imageBanner){
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    try {
        const product = await Product.create({
            imageLogo,
            textRu:req.body.textRu,
            textUz:req.body.textUz,
            model:req.body.model,
            imageBanner
        })
        res.status(201).send(product)

    } catch (error) {
        res.send(error.message)
    }

})

//PUT

router.put('/:id', [auth,validId], async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody([req.body.mediaLogoId,req.body.mediaBannerId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const imageLogo= await Media.findById(req.body.mediaLogoId)
    const imageBanner= await Media.findById(req.body.mediaBannerId)

    if (!imageLogo || !imageBanner){
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, {
            imageLogo,
            textRu:req.body.textRu,
            textUz:req.body.textUz,
            model:req.body.model,
            imageBanner
        }, {new: true})
        if (!product) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.status(201).send(product)

    } catch (error) {
        res.send(error.message)
    }

})

//DELETE

router.delete('/:id', [auth,validId], async (req, res) => {


    const product = await Product.findByIdAndRemove(req.params.id)

    if (!product) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }
    const imagesId = [product.imageLogo._id,product.imageBanner._id]


    try {

        await Media.deleteMany({_id: {$in: imagesId}})
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                res.send(error.message)
            });
        await deleteMedias([product.imageLogo,product.imageBanner])
        res.send(product)
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router