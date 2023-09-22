const mongoose=require('mongoose')
const Joi=require('joi')

const orderSchema=new mongoose.Schema({
    userName:{type:String,required:true},
    phone:{type:String,required:true},
    model:{type:String,required:true},
    position:{type:String,required: true},
    exterior:{type:String,required: true},
    interior:{type:String,required: true},
    option:[{type:String}],
    price:{type:Number,required: true}
},{
    timestamps:true
})

const Order=mongoose.model('Order',orderSchema)


function validate(order){
    const validateOrder=Joi.object({
        userName:Joi.string().required(),
        phone:Joi.string().required(),
        model:Joi.string().required(),
        position:Joi.string().required(),
        exterior:Joi.string().required(),
        interior:Joi.string().required(),
        option:Joi.array().items(Joi.string()),
        price:Joi.number().integer().required()

    })

    return validateOrder.validate(order)
}


module.exports.Order=Order
module.exports.validate=validate