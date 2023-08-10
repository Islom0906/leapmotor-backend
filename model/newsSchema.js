const mongoose=require('mongoose')
const Joi=require('joi')
const {mediaSchema}=require('./mediaSchema')


const descriptionSchema=mongoose.Schema({
    textRu:{
        type:String,
        required:true,
    },
    textUz:{
        type:String,
        required:true,
    },
    image:{
        type:mediaSchema,
        required:true
    }
})

const newsSchema=mongoose.Schema({
    titleRu:{
        type:String,
        required:true,
        unique:true
    },
    titleUz:{
        type:String,
        required:true,
    },
    description:{
        type:[descriptionSchema],
        required:true
    },
    slug:{
        type:String,
        required:true
    }
},
    {
        timestamps:true
    })

const News=mongoose.model('News',newsSchema)

function validate(news){
    const validateNews=Joi.object({
        titleRu:Joi.string().required(),
        titleUz:Joi.string().required(),
        description:Joi.array().items(Joi.object({
                textRu: Joi.string().required(),
                textUz: Joi.string().required(),
                mediaId:Joi.string().required()
            }
        )).required()

    })

    return validateNews.validate(news)
}


module.exports.News=News
module.exports.validate=validate