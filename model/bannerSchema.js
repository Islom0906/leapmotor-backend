const mongoose=require('mongoose')
const Joi=require('joi')
const {mediaSchema}=require('./mediaSchema')

const bannerSchema= mongoose.Schema({
    imageLogo:{
        type:mediaSchema,
        required:true,
    },
    imageBrand:{
        type:mediaSchema,
        required:true,
    },
    videoBanner:{
        type:mediaSchema,
        required:true,
    }
})

const Banner=mongoose.model('Banner',bannerSchema)

function validate(banner){
    const validateBanner=Joi.object({
        mediaLogoId:Joi.string().required(),
        mediaBrandId:Joi.string().required(),
        mediaVideoId:Joi.string().required(),
    })

    return validateBanner.validate(banner)
}


module.exports.Banner=Banner
module.exports.validate=validate