const express = require('express')
const router = express.Router()
const {Token} = require('../model/oAuthTokenSchema')
const auth = require('../middleware/auth')
const axios = require('../utils/axios');


// POST
router.post('/', auth, async (req, res) => {
    try {
        const response = await axios.post(`/oauth2/access_token`, req.body);
        const {access_token, refresh_token} = response.data;
        let token = null
        const getToken = await Token.find()

        if (getToken.length > 0) {
            token = await Token.findByIdAndUpdate(getToken[0]._id, {
                accessToken: access_token,
                refreshToken: refresh_token,
                clientId:req.body.client_id,
                clientSecret:req.body.client_secret
            }, {new: true})
        } else {
            token = await Token.create({
                accessToken: access_token,
                refreshToken: refresh_token,
                clientId:req.body.client_id,
                clientSecret:req.body.client_secret

            });
        }


        res.status(201).send(token)
    } catch (error) {
        res.send(error.message)
    }
})


module.exports = router