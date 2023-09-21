const mongoose=require('mongoose')
const Joi=require('joi')

const orderSchema=mongoose.Schema({
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
        model:Joi.string().required(),
        position:Joi.string().required(),
        exterior:Joi.string().required(),
        interior:Joi.string().required(),
        option:Joi.array().items(Joi.string()),
        price:Joi.number().required()

    })

    return validateOrder.validate(order)
}


module.exports.Order=Order
module.exports.validate=validate