const mongoose=require('mongoose')
const Joi=require('joi')
const {mediaSchema}=require('./mediaSchema')

const filialInnerSchema=mongoose.Schema({
    images:{
        type:[mediaSchema],
        required:true,
    },

})

const FilialInner=mongoose.model('FilialInner',filialInnerSchema)

function validate(filialInner){
    const validateFilialInner=Joi.object({
        mediaId:Joi.array().items(Joi.string().required()).required()

    })

    return validateFilialInner.validate(filialInner)
}


module.exports.FilialInner=FilialInner
module.exports.validate=validate