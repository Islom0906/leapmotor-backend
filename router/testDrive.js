const express = require('express')
const router = express.Router()
const {TestDrive, validate} = require('../model/testDriveSchema')
const {TgBot} = require('../model/tgbotSchema')
const validId = require('../middleware/validId')
const auth = require('../middleware/auth')
const bot=require('../utils/telegrambot')

const sendMessageBot=(text)=>{

    const htmlMessage= `
<strong>Заказ тест-драйва</strong>

<strong>Модель</strong>: ${text?.model}
<strong>Область</strong>: ${text?.region}
<strong>Дилер</strong>: ${text?.dealer} 
<strong>День</strong>: ${text?.day}
<strong>Час</strong>: ${text?.hour}
<strong>Имя</strong>: <code>${text?.name}</code>
<strong>Тел</strong>: ${text?.tel}
`
 return htmlMessage

}


// GET
router.get('/', async (req, res) => {
    const testDrive = await TestDrive.find()
    res.send(testDrive)
})
// GET ID
router.get('/:id', validId, async (req, res) => {
    const testDrive = await TestDrive.findById(req.params.id)

    if (!testDrive) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(testDrive)
})

// POST
router.post('/', async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    try {
        const testDrive = await TestDrive.create(req.body)
        const chatIds = await TgBot.find()
        chatIds?.map(async (chat) => {
            try {

                if (chat?.role === 'all') {
                    await bot.sendMessage(chat?.tgId, sendMessageBot(testDrive), {parse_mode: 'HTML'})
                }
                if (chat?.role === 'drive') {
                    await bot.sendMessage(chat?.tgId, sendMessageBot(testDrive), {parse_mode: 'HTML'})
                }
            } catch (err) {
                res.send(err.message)
            }

        })
        res.status(201).send(testDrive)

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

    try {
        const testDrive = await TestDrive.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (!testDrive) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }

        res.send(testDrive)
    } catch (error) {
        res.send(error.message)
    }

})

//DELETE

router.delete('/:id', validId, async (req, res) => {
    const testDrive = await TestDrive.findByIdAndRemove(req.params.id)

    if (!testDrive) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(testDrive)
})

module.exports = router