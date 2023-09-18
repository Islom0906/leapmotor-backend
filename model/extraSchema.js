const mongoose = require('mongoose')
const Joi = require('joi')
const {mediaSchema}=require('./mediaSchema')


const positionSchema = mongoose.Schema({
    model:{type: String,required: true},
    position: {type: String, required: true},
    name: {type: String, required: true},
    colorImage: {type: mediaSchema, required: true},
    image: {type: mediaSchema, required: true},
    price: {type: String},
    commentPrice: {type: String}
})

const Position = mongoose.model('Position', positionSchema)

function validate(position) {
    const Position = Joi.object({
        model: Joi.string().required(),
        position: Joi.string().required(),
        name:Joi.string().required(),
        colorMediaId:Joi.string().required(),
        mediaId:Joi.string().required(),
        price:Joi.string(),
        commentPrice:Joi.string(),
    })

    return Position.validate(position)
}

module.exports.Position = Position
module.exports.validate = validate