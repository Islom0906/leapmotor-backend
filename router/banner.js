const express = require('express')
const router = express.Router()
const {Banner, validate} = require('../model/bannerSchema')
const {Media} = require('../model/mediaSchema')
const validId = require('../middleware/validId')
const isValidIdBody = require("../utils/isValidIdBody");
const deleteMedias = require("../utils/deleteMedias");
const auth=require('../middleware/auth')
// GET
router.get('/', async (req, res) => {
    const banner = await Banner.find()

    res.send(banner[0])
})




// POST
router.post('/',auth, async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const ValidId = isValidIdBody([req.body.mediaLogoId,req.body.mediaBrandId,req.body.mediaVideoId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const imageLogo= await Media.findById(req.body.mediaLogoId)
    const imageBrand= await Media.findById(req.body.mediaBrandId)
    const videoBanner= await Media.findById(req.body.mediaVideoId)

    if (!imageLogo || !imageBrand ||!videoBanner){
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    try {
        const banner = await Banner.create({
            imageLogo,
            imageBrand,
            videoBanner
        })
        res.status(201).send(banner)

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

    const ValidId = isValidIdBody([req.body.mediaLogoId,req.body.mediaBrandId,req.body.mediaVideoId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const imageLogo= await Media.findById(req.body.mediaLogoId)
    const imageBrand= await Media.findById(req.body.mediaBrandId)
    const videoBanner= await Media.findById(req.body.mediaVideoId)


    if (!imageLogo || !imageBrand ||!videoBanner){
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, {
            imageLogo,
            imageBrand,
            videoBanner
        }, {new: true})

        if (!banner) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.status(201).send(banner)

    } catch (error) {
        res.send(error.message)
    }

})

//DELETE

router.delete('/:id', [auth,validId], async (req, res) => {


    const banner = await Banner.findByIdAndRemove(req.params.id)

    if (!banner) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }
    const imagesId = [banner.imageLogo._id,banner.imageBrand._id,banner.videoBanner._id]

    console.log(banner)
    try {

        await Media.deleteMany({_id: {$in: imagesId}})
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                res.send(error.message)
            });
        await deleteMedias([banner.imageLogo,banner.imageBrand,banner.videoBanner])
        res.send(banner)
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router