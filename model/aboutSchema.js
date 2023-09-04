const mongoose=require('mongoose')
const Joi=require('joi')
const {mediaSchema}=require('./mediaSchema')


const mainSectionSchema=mongoose.Schema({
    textRu:{
        type: String,
        required: true
    },
    textUz:{
        type: String,
        required: true
    },
    imageMain:{
        type:mediaSchema,
        required:true
    }
})

const teamSchema=mongoose.Schema({
    image:{
        type:mediaSchema,
        required:true
    },
    nameRu:{
        type: String,
        required: true
    },
    nameUz:{
        type: String,
        required: true
    },
    levelRu:{
        type: String,
        required: true
    },
    levelUz:{
        type: String,
        required: true
    }

})

const aboutCompanySchema=mongoose.Schema({
    descriptionRu:{
        type:String,
        required:true
    },
    descriptionUz: {
        type: String,
        required: true
    },
    team:{
        type:[teamSchema],
        required:true
    }
})

const researchSchema=mongoose.Schema({
    titleRu:{
        type: String,
        required: true
    },
    titleUz:{
        type: String,
        required: true
    },
    textRu:{
        type: String,
        required: true
    },
    textUz:{
        type: String,
        required: true
    },
    image:{
        type:mediaSchema,
        required:true
    }
})

const systemsSchema=mongoose.Schema({
    image:{
        type:mediaSchema,
        required:true
    },
    titleRu:{
        type: String,
        required: true
    },
    titleUz:{
        type: String,
        required: true
    },
    descriptionRu:{
        type: String,
        required: true
    },
    descriptionUz:{
        type: String,
        required: true
    }

})

const aboutSystemsSchema=mongoose.Schema({
    descriptionRu:{
        type:String,
        required:true
    },
    descriptionUz: {
        type: String,
        required: true
    },
    systems:{
        type:[systemsSchema],
        required:true
    }
})

const aboutSchema=mongoose.Schema({
   mainSection:{
       type:mainSectionSchema,
       required:true
   },
    video:{
       type:mediaSchema,
        required:true
    },
    aboutCompany:{
       type:aboutCompanySchema,
        required:true
    },
    research:{
       type:researchSchema,
        required:true
    },
    aboutSystems:{
        type:aboutSystemsSchema,
        required:true
    }
})

const About=mongoose.model('About',aboutSchema)

function validate(about){
    const About=Joi.object({
        mainSection:Joi.object({
            textRu:Joi.string().required(),
            textUz:Joi.string().required(),
            mediaId:Joi.string().required()
        }).required(),
        videoId:Joi.string().required(),
        aboutCompany:Joi.object({
            descriptionRu:Joi.string().required(),
            descriptionUz:Joi.string().required(),
            team:Joi.array().items(Joi.object({
                mediaId:Joi.string().required(),
                nameRu:Joi.string().required(),
                nameUz:Joi.string().required(),
                levelRu:Joi.string().required(),
                levelUz:Joi.string().required()
            }))
        }).required(),
        research:Joi.object({
            titleRu:Joi.string().required(),
            titleUz:Joi.string().required(),
            textRu:Joi.string().required(),
            textUz:Joi.string().required(),
            mediaId:Joi.string().required(),
        }).required(),
        aboutSystems:Joi.object({
            descriptionRu:Joi.string().required(),
            descriptionUz:Joi.string().required(),
            systems:Joi.array().items(Joi.object({
                mediaId:Joi.string().required(),
                titleRu:Joi.string().required(),
                titleUz:Joi.string().required(),
                descriptionRu:Joi.string().required(),
                descriptionUz:Joi.string().required()
            }))
        }).required()

    })

    return About.validate(about)
}


module.exports.About=About
module.exports.validate=validate