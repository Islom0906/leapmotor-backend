const express = require('express')
const router = express.Router()
const {Order, validate} = require('../model/orderSchema')
const {Position} = require('../model/positionSchema')
const {Exterior} = require('../model/exteriorSchema')
const {Interior} = require('../model/interiorSchema')
const {Option} = require('../model/optionSchema')
const validId = require('../middleware/validId')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
    const position = await Order.find()


    res.send(position)
})


router.get('/:id', validId, async (req, res) => {
    const position = await Order.findById(req.params.id)

    if (!position) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(position)
})


router.post('/', async (req, res) => {
    let customPrice=0
    const optionArr = []
    let checkOption = []

    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    req.body.option.forEach((item) => {
        optionArr.push(item)
    })

    const checkPosition = await Position.find({model: req.body.model, name: req.body.position})
    const checkExterior = await Exterior.find({
        model: req.body.model,
        position: req.body.position,
        name: req.body.exterior
    })
    const checkInterior = await Interior.find({
        model: req.body.model,
        position: req.body.position,
        exterior: req.body.exterior
    })


    await Option.find({
        name: {$in: optionArr}, model: req.body.model, position: req.body.position, exterior: req.body.exterior
    })
        .then((documents) => {
            checkOption = documents
        })
        .catch((err) => {
            res.send('Option topilmadi', err.message);
        });





    if (checkPosition.length!==0 && checkExterior.length!==0 && checkInterior.length!==0){
         customPrice = checkPosition[0].price
            + checkExterior[0].price + checkInterior[0].price

        if (checkOption.length > 0) {
        checkOption?.forEach(item=>{
            customPrice+=item.price
        })
        }

    }



    try {
        if (customPrice===req.body.price){
            const position = await Order.create(req.body)
            res.status(201).send(position)
        }else{
            res.status(400).send('Malumotlar da xatolik borga o\'xshaydi')
        }


    } catch (error) {
        res.send(error.message)
    }
})

// router.put('/:id', validId, async (req, res) => {
//     const {error} = validate(req.body)
//     if (error) {
//         return res.status(400).send(error.details[0].message)
//     }
//
//     try {
//         const position = await Order.findByIdAndUpdate(req.params.id, {}, {new: true})
//         if (!position) {
//             return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
//         }
//         res.status(200).send(position)
//     } catch (error) {
//         res.send(error.message)
//     }
// })

router.delete('/:id', validId, async (req, res) => {
    const position = await Order.findByIdAndRemove(req.params.id)

    if (!position) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

})

module.exports = router
