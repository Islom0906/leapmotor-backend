const express = require('express')
const router = express.Router()
const {Order, validate} = require('../model/orderSchema')
const {Position} = require('../model/positionSchema')
const {Exterior} = require('../model/exteriorSchema')
const {Interior} = require('../model/interiorSchema')
const {Option} = require('../model/optionSchema')
const validId = require('../middleware/validId')
const auth = require('../middleware/auth')
const {TgBot} = require("../model/tgbotSchema");
const bot = require("../utils/telegrambot");


const sendMessageBot=(text)=>{

    const htmlMessage= `
<strong>Заказ машина</strong>

<strong>Модель</strong>: ${text?.model}
<strong>Позиция</strong>: ${text?.position}
<strong>Экстерьер</strong>: ${text?.exterior} 
<strong>Интерьер</strong>: ${text?.interior}
<strong>Параметры</strong>: ${text?.option.map(item=>({item}))}
<strong>Цена</strong>: ${text?.price}

<strong>Имя</strong>: <code>${text?.userName}</code>
<strong>Тел</strong>: ${text?.phone}
`
    return htmlMessage

}

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
            const chatIds = await TgBot.find()
            chatIds?.map(async (chat) => {
                try {

                    if (chat?.role === 'all') {
                        await bot.sendMessage(chat?.tgId, sendMessageBot(position), {parse_mode: 'HTML'})
                    }
                    if (chat?.role === 'order') {
                        await bot.sendMessage(chat?.tgId, sendMessageBot(position), {parse_mode: 'HTML'})
                    }
                } catch (err) {
                    res.send(err.message)
                }

            })
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

router.delete('/:id', [auth,validId], async (req, res) => {
    const position = await Order.findByIdAndRemove(req.params.id)

    if (!position) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

})

module.exports = router
