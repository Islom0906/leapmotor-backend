require('express-async-errors')
const winston = require("winston");
module.exports=()=>{
    winston.add(new winston.transports.Console())
    winston.add(new winston.transports.File({filename:'logs/leapmotor-logs.log',level:'warn'}))
    winston.exceptions.handle(new winston.transports.Console() ,new winston.transports.File({filename:'logs/leapmotor-logs.log'}))
    process.on('unhandledRejection',ex=>{
        throw ex
    })
}