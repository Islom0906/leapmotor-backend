const express = require('express')
const router = express.Router()
const {Map, validate} = require('../model/mapSchema')
const validId = require('../middleware/validId')
const auth=require('../middleware/auth')
const admin=require('../middleware/admin')

// GET
router.get('/', async (req, res) => {
    const map = await Map.find()

    res.send(map)
})
// GET ID
router.get('/:id', validId, async (req, res) => {
    const map = await Map.findById(req.params.id)

    if (!map) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(map)
})

// POST
router.post('/', auth,async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    try {
        const map = await Map.create(req.body)
        res.status(201).send(map)

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
        const map = await Map.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (!map){
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.send(map)
    }catch (error){
        res.send(error.message)
    }

})

//DELETE

router.delete('/:id', [auth,admin,validId], async (req, res) => {
    const map = await Map.findByIdAndRemove(req.params.id)

    if (!map) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(map)
})

module.exports = router