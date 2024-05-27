const express = require('express')
const router = express.Router()
const {Dealers, validate} = require('../model/dealersSchema')
const {TgBot} = require('../model/tgbotSchema')
const validId = require('../middleware/validId')
const auth = require('../middleware/auth')
const bot = require('../utils/telegrambot')
const checkAccessToken = require("../utils/checkAccessToken");
const getToken = require("../utils/getCRMTokens");
const axios = require("../utils/axios");


const sendMessageBot = (text) => {

    const htmlMessage = `
<strong>Новые дилеры</strong>

<strong><i>Общая информация</i></strong>

<strong>Название предприятия</strong>: ${text?.nameEnterprises}
<strong>Регион / Область</strong>: ${text?.region}
<strong>Адрес</strong>: ${text?.address} 
<strong>Численность населения</strong>: ${text?.countUser}

<strong><i>Наличие шоурума</i></strong>

<strong>Наличие шоурума, Общая площадь</strong>: ${text?.showroomTotalArea}
<strong>Наличие шоурума, Полезная площадь </strong>: ${text?.showroomUsableArea}

<strong><i>Наличие СТО</i></strong>

<strong>Наличие СТО, Общая площадь </strong>: ${text?.serviceTotalArea}
<strong>Наличие СТО, Полезная площадь</strong>: ${text?.serviceUsableArea}

<strong><i>Наличие опыта</i></strong>

<strong>Наличие опыта в сфере торговли автомобилями</strong>: ${text?.carExperience}
<strong>Информация о фактически реализованных автомобилях</strong>: ${text?.infoAboutSoldCard}
<strong>Прогноз продаж в месяц</strong>: ${text?.salesMonth}
<strong>Контактное лицо</strong>: <code>${text?.contactPerson}</code>
<strong>Контактный номер</strong>: ${text?.contactPhone}

<strong><i>Прочая информация</i></strong>

<strong>Банковские реквизиты</strong>: ${text?.otherInformation}
`
    return htmlMessage

}


// GET
router.get('/', async (req, res) => {
    const dealers = await Dealers.find()
    res.send(dealers)
})
// GET ID
router.get('/:id', validId, async (req, res) => {
    const dealers = await Dealers.findById(req.params.id)

    if (!dealers) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(dealers)
})

// POST
router.post('/', async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    try {
        const dealers = await Dealers.create(req.body)
        const chatIds = await TgBot.find()
        const errors = [];

        await Promise.all(chatIds?.map(async (chat) => {
            try {

                if (chat?.role === 'all') {
                    await bot.sendMessage(chat?.tgId, sendMessageBot(dealers), {parse_mode: 'HTML'})
                }
                if (chat?.role === 'dealer') {
                    await bot.sendMessage(chat?.tgId, sendMessageBot(dealers), {parse_mode: 'HTML'})
                }
            } catch (err) {
                errors.push(err.message)
            }

        }))




        await checkAccessToken()
        const data = [
            {
                name: "Заказать стать дилером",
                pipeline_id:parseInt(process.env.AMOCRM_COMPANY_PIPELINE_ID),
                custom_fields_values: [
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_SERVICE_AREA),
                        values: [
                            {
                                value: req.body.serviceUsableArea

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_OTHER_INFORMATION),
                        values: [
                            {
                                value: req.body.otherInformation

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_CONTACT_PERSON),
                        values: [
                            {
                                value: req.body.contactPerson

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_SALE_MONTH),
                        values: [
                            {
                                value: req.body.salesMonth

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_SOLD_CARD),
                        values: [
                            {
                                value: req.body.infoAboutSoldCard

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_CAR_EXPERIENS),
                        values: [
                            {
                                value: req.body.carExperience

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_SERVICE_TOTAL_AREA),
                        values: [
                            {
                                value: req.body.serviceTotalArea

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_SHOWROOM_AREA),
                        values: [
                            {
                                value: req.body.showroomUsableArea

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_SHOWROOM_TOTAL_AREA),
                        values: [
                            {
                                value: req.body.serviceTotalArea

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_SHOWROOM_COUNT_USER),
                        values: [
                            {
                                value: req.body.countUser

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_SHOWROOM_ADDRESS),
                        values: [
                            {
                                value: req.body.address

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_REGION),
                        values: [
                            {
                                value: req.body.region

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_NAME_ENTERPRISES),
                        values: [
                            {
                                value: req.body.nameEnterprises

                            }
                        ]
                    },
                    {
                        field_id: parseInt(process.env.AMOCRM_COMPANY_CONTACT_PHONE),
                        values: [
                            {
                                value: req.body.contactPhone

                            }
                        ]
                    },
                ]
            }
        ]

        const {accessToken} = await getToken()
        await axios.post('api/v4/leads', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        res.status(201).send(dealers)

    } catch (error) {
        res.send(error)
    }

})

//PUT

router.put('/:id', [auth, validId], async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    try {
        const dealers = await Dealers.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (!dealers) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.send(dealers)
    } catch (error) {
        res.send(error.message)
    }

})

//DELETE

router.delete('/:id', [auth, validId], async (req, res) => {
    const dealers = await Dealers.findByIdAndRemove(req.params.id)

    if (!dealers) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(dealers)
})

module.exports = router