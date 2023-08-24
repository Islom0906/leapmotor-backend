const express = require('express')
const router = express.Router()
const {TgBot, validate} = require('../model/tgbotSchema')
const validId = require('../middleware/validId')
const auth=require('../middleware/auth')

// GET
router.get('/', async (req, res) => {
    const tgBot = await TgBot.find()
    res.send(tgBot)
})
// GET ID
router.get('/:id', validId,async (req, res) => {
    const tgBot = await TgBot.findById(req.params.id)

    if (!tgBot) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(tgBot)
})

// POST
router.post('/', auth,async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    try {
        const tgBot = await TgBot.create(req.body)
        res.status(201).send(tgBot)

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

    try{
        const tgBot = await TgBot.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (!tgBot){
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }

        res.send(tgBot)
    }catch (error){
        res.send(error.message)
    }

})

//DELETE

router.delete('/:id', [auth,validId], async (req, res) => {
    const tgBot = await TgBot.findByIdAndRemove(req.params.id)

    if (!tgBot) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(tgBot)
})

module.exports = router