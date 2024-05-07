const express = require('express')
const router = express.Router()
const {TestDrive, validate} = require('../model/testDriveSchema')
const {TgBot} = require('../model/tgbotSchema')
const validId = require('../middleware/validId')
const auth = require('../middleware/auth')
const bot = require('../utils/telegrambot')
const axios = require('../utils/axios')
const checkAccessToken = require('../utils/checkAccessToken')
const getToken = require('../utils/getCRMTokens')


const sendMessageBot = (text) => {

    const htmlMessage = `
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
        const errors = [];

        await Promise.all(chatIds?.map(async (chat) => {
            try {

                if (chat?.role === 'all') {
                    await bot.sendMessage(chat?.tgId, sendMessageBot(testDrive), {parse_mode: 'HTML'})
                }
                if (chat?.role === 'drive' && chat?.region === testDrive.region && chat?.dealer === testDrive.dealer) {
                    await bot.sendMessage(chat?.tgId, sendMessageBot(testDrive), {parse_mode: 'HTML'})
                }
            } catch (err) {
                errors.push(err.message)
            }

        }))
        // console.log(errors)
        // if (errors.length > 0) {
        //     return res.status(500).send(errors.join('\n'));
        // }

        await checkAccessToken()
        const data = [
            {
                name: "Тест-драйв",
                pipeline_id:parseInt(process.env.AMOCRM_TEST_DRIVE_PIPELINE_ID),
                custom_fields_values: [
                    {
                        field_id: parseInt(process.env.AMOCRM_LEADS_MODEL_ID),
                        values: [
                            {
                                value: req.body.model

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_LEADS_REGION_ID),
                        values: [
                            {
                                value: req.body.region

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_LEADS_DEALER_ID),
                        values: [
                            {
                                value: req.body.dealer

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_LEADS_DAY_ID),
                        values: [
                            {
                                value: req.body.day

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_LEADS_TIME_ID),
                        values: [
                            {
                                value: req.body.hour

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_LEADS_NAME_ID),
                        values: [
                            {
                                value: req.body.name

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_LEADS_TEL_ID),
                        values: [
                            {
                                value: req.body.tel

                            }
                        ]
                    }
                ]
            }
        ]
        const {accessToken} = await getToken()

   await axios.post('api/v4/leads', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })


        res.status(201).send(testDrive)

    } catch (error) {
        res.send(error.message)
    }

})

//PUT

router.put('/:id', [auth, validId], async (req, res) => {
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

router.delete('/:id', [auth, validId], async (req, res) => {
    const testDrive = await TestDrive.findByIdAndRemove(req.params.id)

    if (!testDrive) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(testDrive)
})

module.exports = router