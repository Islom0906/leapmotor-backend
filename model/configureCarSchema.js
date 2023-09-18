const mongoose = require('mongoose')
const Joi = require('joi')
const {mediaSchema}=require('./mediaSchema')


// postion schemas
const posListSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    info: {
        type: String,
    },
    price: {
        type: String,
        required: true
    },
    includedList: {
        type: [
            String
        ]
    }
})


const positionSchema = mongoose.Schema({
    posImage: {
        type: mediaSchema,
        required: true
    },
    positionList: {
        type: [posListSchema],
        required: true
    }
})

//extra color schemas
const extColorSchema = mongoose.Schema({
    pos: {type: String, required: true},
    name: {type: String, required: true},
    colorImage: {type: mediaSchema, required: true},
    image: {type: mediaSchema, required: true},
    price: {type: String},
    commentPrice: {type: String}
})

//inter color schemas
const interColorSchema = mongoose.Schema({
    extColor: {type: String, required: true},
    name: {type: String, required: true},
    colorImage: {type: mediaSchema, required: true},
    image: {type: mediaSchema, required: true},
    price: {type: String},

})

// option schema
const optionIncludSchema = mongoose.Schema({
    image: {type: mediaSchema},
    title: {type: String},
    comment: {type: String},
    tags: {type: [String]}
})

const optionSchema = mongoose.Schema({
    interColor: {type: String, required: true},
    mainImage: {type: mediaSchema, required: true},
    title: {type: String, required: true},
    price: {type: String, required: true},
    bonus: {type: String},
    includeComment: {type: String},
    includes: {type: [optionIncludSchema]}
})

const configureCarSchema = mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    position: {
        type: positionSchema,
        required: true
    },
    extColor: {
        type: [extColorSchema],
        required: true
    },
    interColor: {
        type: [interColorSchema],
        required: true
    },
    optional: {
        type: [optionSchema],
        required: true
    }
})

const ConfigureCar = mongoose.model('ConfigureCar', configureCarSchema)


function validate(about) {
    const About = Joi.object({
        model: Joi.string().required(),
        position: Joi.object({
            posMediaId: Joi.string().required(),
            positionList: Joi.array().items(Joi.object({
                name: Joi.string().required(),
                info: Joi.string(),
                price: Joi.string().required(),
                includedList: Joi.array().items((Joi.string()))
            }))
        }),
        extColor:Joi.array().items(Joi.object({
            pos:Joi.string().required(),
            name:Joi.string().required(),
            colorMediaId:Joi.string().required(),
            mediaId:Joi.string().required(),
            price:Joi.string(),
            commentPrice:Joi.string(),
        })),
        interColor:Joi.array().items(Joi.object({
            extColor:Joi.string().required(),
            name:Joi.string().required(),
            colorMediaId:Joi.string().required(),
            mediaId:Joi.string().required(),
            price:Joi.string()
        })),
        optional:Joi.array().items(Joi.object({
            interColor:Joi.string().required(),
            mainMediaId:Joi.string().required(),
            title:Joi.string().required(),
            price:Joi.string().required(),
            bonus:Joi.string(),
            includeComment:Joi.string(),
            includes:Joi.array().items(Joi.object({
                medaiId:Joi.string(),
                title:Joi.string().required(),
                comment:Joi.string(),
                tags:Joi.array().items(Joi.string())
            }))
        }))
    })

    return About.validate(about)
}


module.exports.ConfigureCar = ConfigureCar
module.exports.validate = validate