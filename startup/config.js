const config=require('config')

module.exports=()=>{
    if (!config.get('jwtPrivateKey')){
       throw new Error('JIDDIY XATO: leapmotors_jwtPrivateKey muhit o\'zgaruvchisi aniqlanmadi')
    }
}