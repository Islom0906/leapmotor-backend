const express = require("express");
const path = require("path");
const cors=require('cors')
const imageRouter = require("../router/media");
const mapRouter = require("../router/map");
const contactRouter = require("../router/contact");
const newsRouter = require("../router/news");
const filialRouter = require("../router/filial");
const filialInnerRouter = require("../router/filialInner");
const productRouter = require("../router/product");
const bannerRouter = require("../router/banner");
const aboutRouter = require("../router/about");
const testDriveRouter = require("../router/testDrive");
const dealersRouter = require("../router/dealers");
const tgBotRouter = require("../router/tgBot");
const positionRouter = require("../router/position");
const exteriorRouter = require("../router/exterior");
const interiorRouter = require("../router/interior");
const optionRouter = require("../router/option");
const regionRouter = require("../router/region");
const orderRouter = require("../router/order");
const amoCRMRouter = require("../router/amoCRMIntegration");
const userRouter = require("../router/user");
const authRouter = require("../router/auth");
const error = require("../middleware/error");


module.exports=(app)=>{
    const imagesFolderPath=path.join(__dirname,'..')

    app.use(cors())
    app.use('/api/',express.static(imagesFolderPath))
    app.use(express.json())
    app.use('/api/medias',imageRouter)
    app.use('/api/map',mapRouter)
    app.use('/api/contact',contactRouter)
    app.use('/api/news',newsRouter)
    app.use('/api/filial',filialRouter)
    app.use('/api/filialInner',filialInnerRouter)
    app.use('/api/product',productRouter)
    app.use('/api/banner',bannerRouter)
    app.use('/api/about',aboutRouter)
    app.use('/api/testDrive',testDriveRouter)
    app.use('/api/tgBot',tgBotRouter)
    app.use('/api/dealers',dealersRouter)
    app.use('/api/user',userRouter)
    app.use('/api/auth',authRouter)
    app.use('/api/position',positionRouter)
    app.use('/api/exterior',exteriorRouter)
    app.use('/api/interior',interiorRouter)
    app.use('/api/order',orderRouter)
    app.use('/api/option',optionRouter)
    app.use('/api/region',regionRouter)
    app.use('/api/amoCRMIntegration',amoCRMRouter)
    app.use(error)
}