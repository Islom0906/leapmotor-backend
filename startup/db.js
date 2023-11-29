const mongoose=require('mongoose')
const winston=require('winston')


module.exports=()=>{
    mongoose.connect(process.env.DB_URL)
        .then(()=>{
            winston.debug('MongoDbga ulanish hosil qilindi')
        })
}