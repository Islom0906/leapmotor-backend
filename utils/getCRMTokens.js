const {Token} = require("../model/oAuthTokenSchema");


const getToken = async () => {
    const getToken = await Token.find()
    if (getToken[0]) {
        return getToken[0]
    } else {
        return 'token database da mavjud emas'
    }
}

module.exports = getToken