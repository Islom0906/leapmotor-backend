const mongoose=require('mongoose')
const Joi=require('joi')

const contactSchema=mongoose.Schema({
    tel:{
        type:String,
        required:true,
    },
    facebook:{
        type:String,
        required:true,
    },
    twitter:{
        type:String,
        required:true,
    },
    instagram:{
        type:String,
        required:true,
    },
})

const Contact=mongoose.model('Contact',contactSchema)

function validate(contact){
    const validateContact=Joi.object({
        tel:Joi.string().required(),
        facebook:Joi.string().required(),
        twitter:Joi.string().required(),
        instagram:Joi.string().required()

    })

    return validateContact.validate(contact)
}


module.exports.Contact=Contact
module.exports.validate=validate