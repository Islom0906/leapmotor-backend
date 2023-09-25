const mongoose = require('mongoose')
const Joi = require('joi')
const {mediaSchema}=require('./mediaSchema')


const exteriorSchema = new mongoose.Schema({
    model:{type: String, required: true},
    position: {type: String, required: true},
    name: {
        type: String,
        required: true
    },
    colorImage: {type: mediaSchema, required: true},
    image: {type: mediaSchema, required: true},
    price: {type: Number},
    commentPrice: {type: String}
})

exteriorSchema.index({ name: 1 }, { unique: true });

const Exterior = mongoose.model('Exterior', exteriorSchema)

function validate(exterior) {
    const Exterior = Joi.object({
        model: Joi.string().required(),
        position:Joi.string().required(),
        name:Joi.string().required(),
        colorMediaId:Joi.string().required(),
        mediaId:Joi.string().required(),
        price:Joi.number(),
        commentPrice:Joi.string().empty(''),
    })

    return Exterior.validate(exterior)
}

module.exports.Exterior = Exterior
module.exports.validate = validate