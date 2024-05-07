const axios = require('./axios')
const getToken = require("./getCRMTokens");
const {Token} = require("../model/oAuthTokenSchema");

async function getLeads(accessToken) {


    try {
        const leads = await axios.get('api/v4/leads', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return leads.status
    } catch (error) {
        return error.response.status
    }
}

const checkAccessToken = async () => {
    try {
        const token = await getToken()
        const result = await getLeads(token.accessToken)

        if (result === 401) {
            const response = await axios.post(`/oauth2/access_token`, {
                client_id: token.clientId,
                client_secret: token.clientSecret,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
                "redirect_uri": "https://example.com"
            });
            await Token.findByIdAndUpdate(token._id, {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
                clientId: token.client_id,
                clientSecret: token.client_secret
            }, {new: true})
        }
        return true
    } catch (error) {
        return error
    }

}

module.exports = checkAccessToken

