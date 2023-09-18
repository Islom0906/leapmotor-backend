const express = require('express')
const router = express.Router()
const {ConfigureCar, validate} = require('../model/configureCarSchema')
const validId = require('../middleware/validId')
const isValidIdBody = require("../utils/isValidIdBody");
// const {Media} = require("../model/mediaSchema");
const deleteMedias = require("../utils/deleteMedias");
const auth = require('../middleware/auth')

const Joi = require("joi");


// GET
router.get('/', async (req, res) => {
    const configureCar = await ConfigureCar.find()

    res.send(configureCar)
})


// GET BY ID

router.get('/:id', validId, async (req, res) => {
    const configureCar = await ConfigureCar.findById(req.params.id)

    if (!configureCar) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(about)
})


router.post('/', async (req, res) => {
    const positionListArr = []
    // extra color
    const extColorMediaId = []
    const extMediaId = []
    let extColorImage = []
    let extImage = []
    const extColorArr = []
    // inter color
    const interColorMediaId = []
    const interMediaId = []
    let interColorImage = []
    let interImage = []
    const interColorArr = []
    // option
    const optionMediaId=[]
    const optionArr=[]

    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    // position
    req.body.position.positionList.forEach((item) => {

        const position = {
            name: item.name,
            info: item.info,
            price: item.price,
            includedList: item.includedList
        }

        positionListArr.push(position)
    })
    // extra color
    req.body.extColor.forEach((item) => {
        extColorMediaId.push(item.colorMediaId)
        extMediaId.push(item.mediaId)
        const extraColor = {
            pos: item.post,
            name: item.name,
            colorImage: item.colorMediaId,
            image: item.mediaId,
            price: item.price,
            commentPrice: item.commentPrice
        }

        extColorArr.push(extraColor)
    })
    // inter color
    req.body.extColor.forEach((item) => {
        interColorMediaId.push(item.colorMediaId)
        interMediaId.push(item.mediaId)
        const interColor = {
            extColor: item.extColor,
            name: item.name,
            colorImage: item.colorMediaId,
            image: item.mediaId,
            price: item.price,
        }

        interColorArr.push(interColor)
    })
    // option
    req.body.optional.forEach((item) => {
        optionMediaId.push(item.mainMediaId)

        item.includes.forEach((item)=>{

        })
        const option = {
            interColor: item.interColor,
            title: item.title,
            mainImage: item.mainMediaId,
            price: item.price,
            bonus: item.bonus,
            includeComment:item.includeComment
        }

        optionArr.push(option)
    })

    const ValidId = isValidIdBody([req.body.position.posMediaId, ...extColorMediaId, ...extMediaId,...interColorMediaId,...interMediaId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }


    const posImage = await Media.findById(req.body.position.posMediaId)

    // extra color image
    await Media.find({_id: {$in: extColorMediaId}})
        .then((documents) => {
            extColorImage = documents
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message)
        });

    await Media.find({_id: {$in: extMediaId}})
        .then((documents) => {
            extImage = documents
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message)
        });


    // inter color image
    await Media.find({_id: {$in: extColorMediaId}})
        .then((documents) => {
            interColorImage = documents
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message)
        });

    await Media.find({_id: {$in: extMediaId}})
        .then((documents) => {
            interImage = documents
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message)
        });


    // extra color collection
    const extColor = extColorArr.map((item) => {
        for (let i = 0; i < extColorImage.length; i++) {
            if (item.colorImage === extColorImage[i]._id.toString()) {
                item.colorImage = extColorImage[i]
            }
        }

        for (let i = 0; i < extImage.length; i++) {
            if (item.image === extImage[i]._id.toString()) {
                item.image = extImage[i]
            }
        }

        return item
    })

    // extra color collection
    const interColor = interColorArr.map((item) => {
        for (let i = 0; i < interColorImage.length; i++) {
            if (item.colorImage === interColorImage[i]._id.toString()) {
                item.colorImage = interColorImage[i]
            }
        }

        for (let i = 0; i < interImage.length; i++) {
            if (item.image === interImage[i]._id.toString()) {
                item.image = interImage[i]
            }
        }

        return item
    })



    try {
        const configureCar = await ConfigureCar.create({
            model: req.body.model,
            position: {
                posImage,
                positionList: positionListArr
            },
            extColor,
            interColor
        })

        res.status(201).send(configureCar)
    } catch (error) {
        res.send(error.message)
    }
})