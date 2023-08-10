const mongoose=require('mongoose')

module.exports=(req,res,next)=>{
    const valid=mongoose.Types.ObjectId.isValid(req.params.id)
    if (!valid){
        return res.status(400).send('Mavjud bo\'lmagan ID')
    }

    next()
}