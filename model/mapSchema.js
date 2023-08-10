const mongoose=require('mongoose')
const Joi=require('joi')

const mapSchema=mongoose.Schema({
    x:{
        type:String,
        required:true,
        unique:true
    },
    y:{
        type:String,
        required:true,
        unique:true
    },
})

const Map=mongoose.model('Map',mapSchema)

function validate(map){
    const validateMap=Joi.object({
        x:Joi.string().required(),
        y:Joi.string().required()

    })

    return validateMap.validate(map)
}


module.exports.Map=Map
module.exports.validate=validate