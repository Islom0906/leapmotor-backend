const mongoose=require('mongoose')
const Joi=require('joi')

const tgBotSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    tgId:{
        type:String,
        required:true,
        unicode:true
    },
    role:{
        type:String,
        required:true,
    },
    region:{
        type:String,
        required:false
    },
    dealer:{
        type:String,
        required:false
    },

})



const TgBot=mongoose.model('TgBot',tgBotSchema)

function validate(tgBot){
    const validateTgBot=Joi.object({
        name:Joi.string().required(),
        tgId:Joi.string().required(),
        role:Joi.string().required(),
        region:Joi.string().allow(''),
        dealer:Joi.string().allow('')
    })

    return validateTgBot.validate(tgBot)
}


module.exports.TgBot=TgBot
module.exports.validate=validate


