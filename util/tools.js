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
