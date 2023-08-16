const express = require('express')
const router = express.Router()
const {News, validate} = require('../model/newsSchema')
const {Media} = require('../model/mediaSchema')
const validId = require('../middleware/validId')
const isValidIdBody=require('../utils/isValidIdBody')
const deleteMedias=require('../utils/deleteMedias')
const krillToLotin=require('../utils/krillToLotin')
const slugify = require("slugify");
const auth=require('../middleware/auth')

// GET
router.get('/', async (req, res) => {
    const news = await News.find().sort({updatedAt:1})

    res.send(news)
})
// GET ID
router.get('/:slug',auth, async (req, res) => {
    const news = await News.findOne({slug:req.params.slug})

    if (!news) {
        res.status(400).send('Berilgan Slug bo\'yicha malumot topilmadi')
    }

    res.send(news)
})

// POST
router.post('/',auth, async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const imagesId = []
    let images = []
    const descriptionArr = []
    req.body.description.forEach(item => {

        imagesId.push(item.mediaId)
        const desc = {
            textRu: item.textRu,
            textUz: item.textUz,
            image: item.mediaId
        }
        descriptionArr.push(desc)
    })

    const ValidId = isValidIdBody(imagesId)
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    await Media.find({_id: {$in: imagesId}})
        .then((documents) => {
            images = documents
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message)
        });


    const description = descriptionArr.map((item, ind) => {
        for (let i = 0; i < images.length; i++) {
            if (item.image === images[i]._id.toString()) {
                item.image = images[i]
            }
        }

        return item
    })

    const slug=slugify(krillToLotin(req.body.titleRu))

    try {
        const news = await News.create({
            titleRu: req.body.titleRu,
            titleUz: req.body.titleUz,
            description,
            slug
        })
        res.status(201).send(news)

    } catch (error) {
        res.send(error.message)
    }

})

//PUT
router.put('/:id',[auth,validId], async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const imagesId = []
    let images = []
    const descriptionArr = []
    req.body.description.forEach(item => {
        imagesId.push(item.mediaId)
        const desc = {
            textRu: item.textRu,
            textUz: item.textUz,
            image: item.mediaId
        }
        descriptionArr.push(desc)
    })

    const ValidId = isValidIdBody(imagesId)
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    await Media.find({_id: {$in: imagesId}})
        .then((documents) => {
            images = documents
        })
        .catch((err) => {
            res.send(err.message)
        });


    const description = descriptionArr.map((item) => {
        for (let i = 0; i < images.length; i++) {
            if (item.image === images[i]._id.toString()) {
                item.image = images[i]
            }
        }

        return item
    })

    const slug=slugify(krillToLotin(req.body.titleRu))

    try {
        const news = await News.findByIdAndUpdate(req.params.id,
            {
                titleRu: req.body.titleRu,
                titleUz: req.body.titleUz,
                description
            }
            , {new: true})
        if (!news) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.send(news)
    } catch (error) {
        res.send(error.message)
    }

})

//DELETE
router.delete('/:id', [auth,validId], async (req, res) => {
    const news = await News.findByIdAndRemove(req.params.id)

    if (!news) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    const imagesId = []
    const imagesName=[]
    news.description.forEach(item => {
        imagesId.push(item.image._id.toString())
        imagesName.push(item.image)
    })

    await Media.deleteMany({_id: {$in: imagesId}})
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            res.send(error.message)
        });
    await deleteMedias(imagesName)
    res.send(news)
})




module.exports = router