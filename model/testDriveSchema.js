const mongoose=require('mongoose')
const Joi=require('joi')

const testDriveSchema=mongoose.Schema({
    model:{
        type:String,
        required:true,
    },
    region:{
        type:String,
        required:true,
    },
    dealer:{
        type:String,
        required:true,
    },
    day:{
        type:String,
        required:true,
    },
    hour:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    tel:{
        type:String,
        required:true,
    }

},
    {
        timestamps:true
    })

const TestDrive=mongoose.model('TestDrive',testDriveSchema)

function validate(testDrive){
    const validateTestDrive=Joi.object({
        model:Joi.string().required(),
        region:Joi.string().required(),
        dealer:Joi.string().required(),
        day:Joi.string().required(),
        hour:Joi.string().required(),
        name:Joi.string().required(),
        tel:Joi.string().required(),

    })

    return validateTestDrive.validate(testDrive)
}


module.exports.TestDrive=TestDrive
module.exports.validate=validate