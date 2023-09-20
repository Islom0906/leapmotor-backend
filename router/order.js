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
    const optionArr=[]
   const checkOption=[]

    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }



    const checkPosition=await Position.find({model:req.body.model,name:req.body.position})
    const checkExterior=await Exterior.find({model:req.body.model,position:req.body.position,name:req.body.exterior})
    const checkInterior=await Interior.find({model:req.body.model,position:req.body.position,exterior:req.body.exterior})


    await Media.find({ name: { $in: optionArr } })
        .then((documents) => {
            teamImage = documents.map((document) => {
                return { ...document.toObject(), model: 'T03' };
            });
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message);
        });

    await Option.find({model:req.body.model,position:req.body.position,exterior:req.body.exterior,name:req.body.option})

    console.log(checkPosition)
    console.log(checkExterior)
    console.log(checkInterior)
    console.log(checkOption)





    try {
        const position = await Order.create({

        })

        res.status(201).send(position)
    } catch (error) {
        res.send(error.message)
    }
})

router.put('/:id', validId, async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    try {
        const position = await Order.findByIdAndUpdate(req.params.id, {

        },{new:true})
        if (!position) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.status(200).send(position)
    } catch (error) {
        res.send(error.message)
    }
})

router.delete('/:id', validId, async (req, res) => {
    const position = await Order.findByIdAndRemove(req.params.id)

    if (!position) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

})

module.exports = router
