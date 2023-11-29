const mongoose=require('mongoose')
const Joi=require('joi')

const mapSchema=mongoose.Schema({
    nameRu:{
        type:String,
        required:true,
    },
    nameUz:{
        type:String,
        required:true,
    },
    addressRu:{
        type:String,
        required:true,
    },
    addressUz:{
        type:String,
        required:true,
    },
    workingTime:{
        type:String,
        required:true,
    },
    tel:{
        type:String,
        required:true,
    },
    lat:{
        type:String,
        required:true,
        unique:true
    },
    lng:{
        type:String,
        required:true,
        unique:true

    },
    link:{
        type:String,
        required:true
    }
})

const Map=mongoose.model('Map',mapSchema)

function validate(map){
    const validateMap=Joi.object({
        nameRu:Joi.string().required(),
        nameUz:Joi.string().required(),
        addressRu:Joi.string().required(),
        addressUz:Joi.string().required(),
        workingTime:Joi.string().required(),
        tel:Joi.string().required(),
        lat:Joi.string().required(),
        lng:Joi.string().required(),
        link:Joi.string().required()

    })

    return validateMap.validate(map)
}


module.exports.Map=Map
module.exports.validate=validate


