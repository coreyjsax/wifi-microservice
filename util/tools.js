const request = require('request-promise-cache');

exports.getReqHeader = (data) => {
    let ip = req.ip;
    let userAgent = req.get('user-agent');
    let reqHeader = {
        ip: ip,
        userAgent: userAgent
    }
    return reqHeader;
}

exports.addUserToFTEmail = (user) => {
    return request({
        url: `https://marketing.foodtecsolutions.com/publicapi/users/register`,
        body: user,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Fts-Api-Token": process.env.FT_M_token,
        },
        method: 'POST'
    })
    .then((res) => JSON.parse(res))
    .catch((err) => err)
}

exports.ftConfig = () => {
    return request({
        url: `https://marketing.foodtecsolutions.com/publicapi/merchant/config`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Fts-Api-Token": process.env.FT_M_token
        }
    }).then((res) => JSON.parse(res))
      .catch((err) => err)
}

exports.addUserToEmailList = (user, loc) => {
    let store = '';
    switch(loc){
        case 'downtown':
            store = "Pizza Luce I - Downtown";
            break;
        case 'uptown':
            store = 'Pizza Luce II - Uptown';
            break;
        case 'duluth':
            store = ''
        default:
    }
    return request({
        url: `https://marketing.foodtecsolutions.com/publicapi/users/subscribe`,
        body: `{\"name":\"${user.name}\",\"email\":\"${user.email}\",\"store\":\"${store}\"}`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Fts-Api-Token": process.env.FT_M_token
        },
        method: "POST"
    }).then((res) => JSON.parse(res))
    .catch((err) => err)
}