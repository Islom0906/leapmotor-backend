require('express-async-errors')
const winston = require("winston");
module.exports=()=>{
    winston.add(new winston.transports.Console())
    winston.add(new winston.transports.File({filename:'logs/leapmotor-logs.logs',level:'error'}))
    winston.exceptions.handle(new winston.transports.Console() ,new winston.transports.File({filename:'logs/leapmotor-logs.logs'}))
    process.on('unhandledRejection',ex=>{
        throw ex
    })
}