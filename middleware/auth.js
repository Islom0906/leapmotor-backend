const jwt=require('jsonwebtoken')
const config=require('config')

const auth=(req,res,next)=>{
    const authHeader=req.header('Authorization')
    if (!authHeader){
        return  res.status(401).send('Token bo\'lmaganligi uchun so\'rov raq etildi')
    }
    const tokenSplit=authHeader.split(' ')
    const token=tokenSplit[0]==='Bearer' && tokenSplit[1]

    if (!token){
        return  res.status(401).send('Token bo\'lmaganligi uchun so\'rov raq etildi')
    }

    try{
        req.user=jwt.verify(token, config.get('jwtPrivateKey'))
        next()
    }catch (err){
        console.error(err)
        res.status(400).send('Token yaroqli emas')
    }

}

module.exports=auth