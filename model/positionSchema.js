const mongoose = require('mongoose')
const Joi = require('joi')
const {mediaSchema} = require('./mediaSchema')


const positionSchema = mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    image: {
        type: mediaSchema,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    info: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    includedList: [{type: String}]
})

const Position = mongoose.model('Position', positionSchema)

function validate(position) {
    const Position = Joi.object({
        model: Joi.string().required(),
        name: Joi.string().required(),
        info: Joi.string(),
        price: Joi.number().required(),
        includedList: Joi.array().items((Joi.string())),
        mediaId: Joi.string().required()
    })

    return Position.validate(position)
}

module.exports.Position = Position
module.exports.validate = validate