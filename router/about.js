const express = require('express')
const router = express.Router()
const {About, validate} = require('../model/aboutSchema')
const validId = require('../middleware/validId')
const isValidIdBody = require("../utils/isValidIdBody");
const {Media} = require("../model/mediaSchema");
const deleteMedias = require("../utils/deleteMedias");
// const auth=require('../middleware/auth')
// const admin=require('../middleware/admin')

// GET
router.get('/', async (req, res) => {
    const about = await About.find()
    res.send(about)
})

// POST
router.post('/', async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const aboutCompanyImageId=[]
    const aboutSystemsImageId=[]
    let teamImage=[]
    let systemsImage=[]
    let teamArr=[]
    let systemArr=[]


    req.body.aboutCompany.team.forEach(item=>{
        aboutCompanyImageId.push(item.mediaId)
        let team={
            nameRu:item.nameRu,
            nameUz:item.nameUz,
            levelRu:item.levelRu,
            levelUz:item.levelUz,
            image:item.mediaId
        }

        teamArr.push(team)
    })

    req.body.aboutSystems.systems.forEach(item=>{
        aboutSystemsImageId.push(item.mediaId)

        let system={
            titleRu:item.titleRu,
            titleUz:item.titleUz,
            descriptionRu:item.descriptionRu,
            descriptionUz:item.descriptionUz,
            image:item.mediaId
        }

        systemArr.push(system)
    })


    const ValidId = isValidIdBody([req.body.mainSection.mediaId,req.body.videoId,req.body.research.mediaId,...aboutCompanyImageId,...aboutSystemsImageId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }



    const imageMain=await Media.findById(req.body.mainSection.mediaId)
    const video=await Media.findById(req.body.videoId)
    const researchImage=await Media.findById(req.body.research.mediaId)

    await Media.find({_id: {$in: aboutCompanyImageId}})
        .then((documents) => {
            teamImage = documents
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message)
        });

    await Media.find({_id: {$in: aboutSystemsImageId}})
        .then((documents) => {
            systemsImage = documents
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message)
        });
    const team = teamArr.map((item) => {
        for (let i = 0; i < teamImage.length; i++) {
            if (item.image === teamImage[i]._id.toString()) {
                item.image = teamImage[i]
            }
        }

        return item
    })

    const systems = systemArr.map((item) => {
        for (let i = 0; i < systemsImage.length; i++) {
            if (item.image === systemsImage[i]._id.toString()) {
                item.image = systemsImage[i]
            }
        }

        return item
    })
    try {
        const about = await About.create({
            mainSection:{
                textRu:req.body.mainSection.textRu,
                textUz:req.body.mainSection.textUz,
                imageMain
            },
            video,
            aboutCompany:{
                descriptionRu:req.body.aboutCompany.descriptionRu,
                descriptionUz:req.body.aboutCompany.descriptionUz,
                team
            },
            research:{
                titleRu:req.body.research.titleRu,
                titleUz:req.body.research.titleUz,
                textRu:req.body.research.textRu,
                textUz:req.body.research.textUz,
                image:researchImage
            },
            aboutSystems:{
                descriptionRu:req.body.aboutSystems.descriptionRu,
                descriptionUz:req.body.aboutSystems.descriptionUz,
                systems
            },
        })
        res.status(201).send(about)

    } catch (error) {
        res.send(error.message)
    }

})

//PUT

router.put('/:id', validId, async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const aboutCompanyImageId=[]
    const aboutSystemsImageId=[]
    let teamImage=[]
    let systemsImage=[]
    let teamArr=[]
    let systemArr=[]


    req.body.aboutCompany.team.forEach(item=>{
        aboutCompanyImageId.push(item.mediaId)
        let team={
            nameRu:item.nameRu,
            nameUz:item.nameUz,
            levelRu:item.levelRu,
            levelUz:item.levelUz,
            image:item.mediaId
        }

        teamArr.push(team)
    })

    req.body.aboutSystems.systems.forEach(item=>{
        aboutSystemsImageId.push(item.mediaId)

        let system={
            titleRu:item.titleRu,
            titleUz:item.titleUz,
            descriptionRu:item.descriptionRu,
            descriptionUz:item.descriptionUz,
            image:item.mediaId
        }

        systemArr.push(system)
    })


    const ValidId = isValidIdBody([req.body.mainSection.mediaId,req.body.videoId,req.body.research.mediaId,...aboutCompanyImageId,...aboutSystemsImageId])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }



    const imageMain=await Media.findById(req.body.mainSection.mediaId)
    const video=await Media.findById(req.body.videoId)
    const researchImage=await Media.findById(req.body.research.mediaId)

    await Media.find({_id: {$in: aboutCompanyImageId}})
        .then((documents) => {
            teamImage = documents
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message)
        });

    await Media.find({_id: {$in: aboutSystemsImageId}})
        .then((documents) => {
            systemsImage = documents
        })
        .catch((err) => {
            res.send('Imagelarni topishda xatolikka yo\'l qoyildi', err.message)
        });

    const team = teamArr.map((item) => {
        for (let i = 0; i < teamImage.length; i++) {
            if (item.image === teamImage[i]._id.toString()) {
                item.image = teamImage[i]
            }
        }

        return item
    })

    const systems = systemArr.map((item) => {
        for (let i = 0; i < systemsImage.length; i++) {
            if (item.image === systemsImage[i]._id.toString()) {
                item.image = systemsImage[i]
            }
        }

        return item
    })

    try{
        const about = await About.findByIdAndUpdate(req.params.id, {
            mainSection:{
                textRu:req.body.mainSection.textRu,
                textUz:req.body.mainSection.textUz,
                imageMain
            },
            video,
            aboutCompany:{
                descriptionRu:req.body.aboutCompany.descriptionRu,
                descriptionUz:req.body.aboutCompany.descriptionUz,
                team
            },
            research:{
                titleRu:req.body.research.titleRu,
                titleUz:req.body.research.titleUz,
                textRu:req.body.research.textRu,
                textUz:req.body.research.textUz,
                image:researchImage
            },
            aboutSystems:{
                descriptionRu:req.body.aboutSystems.descriptionRu,
                descriptionUz:req.body.aboutSystems.descriptionUz,
                systems
            },
        }, {new: true})
        if (!about){
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }

        res.send(about)
    }catch (error){
        res.send(error.message)
    }

})

//DELETE

router.delete('/:id', validId, async (req, res) => {
    const about = await About.findByIdAndRemove(req.params.id)

    const imagesId=[about.mainSection.imageMain._id,about.video._id,about.research.image._id]
    const imagesName=[about.mainSection.imageMain,about.video,about.research.image]


    about.aboutCompany.team.map(item=>{
        imagesId.push(item.image._id)
        imagesName.push(item.image)
    })

    about.aboutSystems.systems.map(item=>{
        imagesId.push(item.image._id)
        imagesName.push(item.image)
    })

    await Media.deleteMany({_id: {$in: imagesId}})
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            res.send(error.message)
        });
    await deleteMedias(imagesName)

    if (!about) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(about)
})

module.exports = router