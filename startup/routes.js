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
    const imagesFolderPath=path.join(__dirname)

    app.use(express.static(imagesFolderPath))
    app.use(express.json())
    app.use('/api/media',imageRouter)
    app.use('/api/map',mapRouter)
    app.use('/api/contact',contactRouter)
    app.use('/api/news',newsRouter)
    app.use('/api/filial',filialRouter)
    app.use('/api/filialInner',filialInnerRouter)
    app.use('/api/product',productRouter)
    app.use('/api/banner',bannerRouter)
    app.use('/api/about',aboutRouter)
    app.use('/api/user',userRouter)
    app.use('/api/auth',authRouter)
    app.use(error)
}