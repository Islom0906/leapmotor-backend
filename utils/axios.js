const axios = require("axios");

const instance=axios.create({
    baseURL:process.env.AMOCRM_API_URL

})

module.exports=instance