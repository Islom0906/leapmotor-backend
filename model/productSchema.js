const mongoose=require('mongoose')
const Joi=require('joi')
const {mediaSchema}=require('./mediaSchema')

const productSchema=mongoose.Schema({
    imageLogo:{
        type:mediaSchema,
        required:true,
    },
    textRu:{
        type:String,
        required:true,
    },
    textUz:{
        type:String,
        required:true,
    },
    model:{
        type:String,
        required:true,
    },
    imageBanner:{
        type:mediaSchema,
        required:true,
    }
},
    {
        timestamps:true
    })

const Product=mongoose.model('Product',productSchema)

function validate(product){
    const validateProduct=Joi.object({
        mediaLogoId:Joi.string().required(),
        textRu:Joi.string().required(),
        textUz:Joi.string().required(),
        model:Joi.string().required(),
        mediaBannerId:Joi.string().required()

    })

    return validateProduct.validate(product)
}


module.exports.Product=Product
module.exports.validate=validate