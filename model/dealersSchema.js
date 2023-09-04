const mongoose = require('mongoose')
const Joi = require('joi')

const dealersSchema = mongoose.Schema({
        nameEnterprises: {
            type: String,
            required: true,
        },
        region: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        countUser: {
            type: String,
            required: true,
        },
        showroomTotalArea: {
            type: String,
            required: true,
        },
        showroomUsableArea: {
            type: String,
            required: true,
        },
        serviceTotalArea: {
            type: String,
            required: true,
        },
        serviceUsableArea: {
            type: String,
            required: true,
        },
        carExperience: {
            type: String,
            required: true,
        },
        infoAboutSoldCard: {
            type: String,
            required: true,
        },
        salesMonth: {
            type: String,
            required: true,
        },
        contactPerson: {
            type: String,
            required: true,
        },
        contactPhone: {
            type: String,
            required: true,
        },
        otherInformation: {
            type: String,
            required: true,
        }

    }, {
        timestamps: true
    }
)

const Dealers = mongoose.model('Dealers', dealersSchema)

function validate(dealer) {
    const validateDealers = Joi.object({
        nameEnterprises: Joi.string().required(),
        region: Joi.string().required(),
        address: Joi.string().required(),
        countUser: Joi.string().required(),
        showroomTotalArea: Joi.string().required(),
        showroomUsableArea: Joi.string().required(),
        serviceTotalArea: Joi.string().required(),
        serviceUsableArea: Joi.string().required(),
        carExperience: Joi.string().required(),
        infoAboutSoldCard: Joi.string().required(),
        salesMonth: Joi.string().required(),
        contactPerson: Joi.string().required(),
        contactPhone: Joi.string().required(),
        otherInformation: Joi.string().required()
    })

    return validateDealers.validate(dealer)
}


module.exports.Dealers = Dealers
module.exports.validate = validate


