const express = require('express')
const router = express.Router()
const {Region, validate} = require('../model/regionSchema')
const validId = require('../middleware/validId')
const auth=require('../middleware/auth')
const admin=require('../middleware/admin')

// GET
router.get('/', async (req, res) => {
    const region = await Region.find()

    res.send(region)
})
// GET ID
router.get('/:id', async (req, res) => {
    const region = await Region.findById(req.params.id)

    if (!region) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(region)
})

// POST
router.post('/', auth,async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    try {
        const region = await Region.create(req.body)

        await region.save()
        res.status(201).send(region)

    } catch (error) {
        if (error.code === 11000) {
            // MongoDB duplicate key error (code 11000)
            res.status(400).json({ error: 'Duplicate key error' });
        }  else {
            // Handle other errors here
            res.send(error.message)
        }

    }

})

//PUT

router.put('/:id', [auth,validId], async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    try{
        const region = await Region.findByIdAndUpdate(req.params.id, req.body, {new: true})


        if (!region){
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }

        res.send(region)
    }catch (error){
        if (error.code === 11000) {
            // MongoDB duplicate key error (code 11000)
            res.status(400).json({ error: 'Duplicate key error' });
        }  else {
            // Handle other errors here
            res.send(error.message)
        }

    }

})

//DELETE

router.delete('/:id', [auth,validId], async (req, res) => {
    const region = await Region.findByIdAndRemove(req.params.id)

    if (!region) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(region)
})

module.exports = router