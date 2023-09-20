const mongoose = require('mongoose')
const Joi = require('joi')
const {mediaSchema}=require('./mediaSchema')


const optionIncludSchema = mongoose.Schema({
    image: {type: mediaSchema},
    title: {type: String},
    comment: {type: String},
    tags: [{type: String}]
})

const optionSchema = mongoose.Schema({
    model:{type: String, required: true},
    position: {type: String, required: true},
    exterior:{type: String, required: true},
    interior:{type: String, required: true},
    name: {type: String, required: true,unique:true},
    bonus: {type: String},
    includeComment: {type: String},
    price: {type: Number},
    mainImage: {type: mediaSchema, required: true},
    includes: {type: [optionIncludSchema]}

})

const Option = mongoose.model('Option', optionSchema)

function validate(option) {
    const Option = Joi.object({
        model: Joi.string().required(),
        position:Joi.string().required(),
        exterior:Joi.string().required(),
        interior:Joi.string().required(),
        name:Joi.string().required(),
        bonus:Joi.string().empty(''),
        includeComment:Joi.string().empty(''),
        price:Joi.number().empty(),
        mainMediaId:Joi.string().required(),
        includes:Joi.alternatives().try(
            Joi.array().empty(),
            Joi.array().items(Joi.object({
                mediaId: Joi.string().empty(''),
                title: Joi.string().empty(''),
                comment: Joi.string().empty(''),
                tags: Joi.array(),

            }))
        )

    })

    return Option.validate(option)
}

module.exports.Option = Option
module.exports.validate = validate