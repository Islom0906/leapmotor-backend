const mongoose=require('mongoose')
const winston=require('winston')


module.exports=()=>{
    // mongodb+srv://iabdugofurov99:ZSC5E90lah3sB2mB@cluster0.xwz5w7b.mongodb.net/
    mongoose.connect('mongodb+srv://iabdugofurov99:ZSC5E90lah3sB2mB@cluster0.xwz5w7b.mongodb.net/')
        .then(()=>{
            winston.debug('MongoDbga ulanish hosil qilindi')
        })
}