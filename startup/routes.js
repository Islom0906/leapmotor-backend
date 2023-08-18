const path = require("path");
const express = require("express");
const imageRouter = require("../router/media");
const mapRouter = require("../router/map");
const contactRouter = require("../router/contact");
const newsRouter = require("../router/news");
const filialRouter = require("../router/filial");
const filialInnerRouter = require("../router/filialInner");
const productRouter = require("../router/product");
const bannerRouter = require("../router/banner");
const aboutRouter = require("../router/about");
const userRouter = require("../router/user");
const authRouter = require("../router/auth");
const error = require("../middleware/error");


module.exports=(app)=>{
    const imagesFolderPath=path.join(__dirname,'..')

    app.use(express.static(imagesFolderPath))
    app.use(express.json())
    app.use('/v1/media',imageRouter)
    app.use('/v1/map',mapRouter)
    app.use('/v1/contact',contactRouter)
    app.use('/v1/news',newsRouter)
    app.use('/v1/filial',filialRouter)
    app.use('/v1/filialInner',filialInnerRouter)
    app.use('/v1/product',productRouter)
    app.use('/v1/banner',bannerRouter)
    app.use('/v1/about',aboutRouter)
    app.use('/v1/user',userRouter)
    app.use('/v1/auth',authRouter)
    app.use(error)
}