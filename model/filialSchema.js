const mongoose=require('mongoose')
const Joi=require('joi')
const {mediaSchema}=require('./mediaSchema')

const filialSchema=mongoose.Schema({
    image:{
        type:mediaSchema,
        required:true,
    },
    titleRu:{
        type:String,
        required:true,
    },
    titleUz:{
        type:String,
        required:true,
    }
})

const Filial=mongoose.model('Filial',filialSchema)

function validate(filial){
    const validateFilial=Joi.object({
        mediaId:Joi.string().required(),
        titleRu:Joi.string().required(),
        titleUz:Joi.string().required()

    })

    return validateFilial.validate(filial)
}


module.exports.Filial=Filial
module.exports.validate=validate