const mongoose = require('mongoose')
const Joi = require('joi')
const {mediaSchema}=require('./mediaSchema')


const interiorSchema =new mongoose.Schema({
    model:{type: String, required: true},
    position: {type: String, required: true},
    exterior:{type: String, required: true},
    name: {type: String, required: true,unique:true},
    colorImage: {type: mediaSchema, required: true},
    image: {type: mediaSchema, required: true},
    price: {type: Number},
})

const Interior = mongoose.model('Interior', interiorSchema)

function validate(interior) {
    const Interior = Joi.object({
        model: Joi.string().required(),
        position:Joi.string().required(),
        exterior:Joi.string().required(),
        name:Joi.string().required(),
        colorMediaId:Joi.string().required(),
        mediaId:Joi.string().required(),
        price:Joi.number(),
    })

    return Interior.validate(interior)
}

module.exports.Interior = Interior
module.exports.validate = validate