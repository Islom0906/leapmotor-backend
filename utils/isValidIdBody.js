const mongoose=require('mongoose')

function isValidIDs(ids) {
    if (typeof ids==="string"){
        return mongoose.Types.ObjectId.isValid(ids)
    }
    return ids.every(id => mongoose.Types.ObjectId.isValid(id));
}

module.exports=isValidIDs