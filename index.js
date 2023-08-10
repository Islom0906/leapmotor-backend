const express=require('express')
const app=express()
const mongoose=require('mongoose')
const path=require('path')
const config=require('config')
// ROUTER
const imageRouter=require('./router/media')
const mapRouter=require('./router/map')
const contactRouter=require('./router/contact')
const newsRouter=require('./router/news')
const filialRouter=require('./router/filial')
const filialInnerRouter=require('./router/filialInner')
const productRouter=require('./router/product')
const bannerRouter=require('./router/banner')
const aboutRouter=require('./router/about')
const userRouter=require('./router/user')
const authRouter=require('./router/auth')


// if (!config.get('jwtPrivateKey')){
//     console.error('JIDDIY XATO: leapmotors_jwtPrivateKey muhit o\'zgaruvchisi aniqlanmadi')
//     process.exit(1)
// }

mongoose.connect('mongodb://localhost/leapmotor')
    .then(()=>{
        console.log('MongoDbga ulanish hosil qilindi')
    })
    .catch((err)=>{
        console.error("Mongodbga ulanib bo'lmadi", err)
    })


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




















const port=process.env.PORT || 4100
app.listen(port,()=>{
    console.log(`${port} ni eshitishni boshladim`)
})