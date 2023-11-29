const express=require('express')
const app=express()
require('dotenv').config()
const winston=require('winston')
require('./startup/loggin')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()


const port=process.env.PORT || 4100
app.listen(port,()=>{
    winston.info(`${port} ni eshitishni boshladim`)
})