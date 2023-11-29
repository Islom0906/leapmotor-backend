const mongoose=require('mongoose')
const Joi=require('joi')

const dealersSchema=mongoose.Schema({
    nameRu:{
        type:String,
        required:true,
        unique:true

    },
    nameUz:{
        type:String,
        required:true,
        unique:true

    },
})

const regionSchema=mongoose.Schema({
    nameRu:{
        type:String,
        required:true,
        unique:true
    },
    nameUz:{
        type:String,
        required:true,
        unique:true

    },
    dealers: {
        type: [dealersSchema],
        required:true
    }

})

const Region=mongoose.model('Region',regionSchema)

function validate(region){
    const validateRegion=Joi.object({
        nameRu:Joi.string().required(),
        nameUz:Joi.string().required(),
        dealers:Joi.array().items(Joi.object({
            nameRu:Joi.string(),
            nameUz:Joi.string()
        }))

    })

    return validateRegion.validate(region)
}


module.exports.Region=Region
module.exports.validate=validate


