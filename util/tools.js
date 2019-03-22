const request = require('request-promise-cache');

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
    let location = '';
    let captured = '';
    switch(loc){
        case 'downtown':
            location = "Pizza Luce I - Downtown";
            captured = "pl1-wifi";
            break;
        case 'uptown':
            location = 'Pizza Luce II - Uptown';
            captured = 'pl2-wifi';
            break;
        case 'duluth':
            location = 'Pizza Luce III - Duluth';
            captured = 'pl3-wifi';
        case 'seward':
            location = 'Pizza Luce IV - Seward';
            captured = 'pl4-wifi';
        case 'stpaul':
            location = 'Pizza Luce V - St Paul';
            captured = 'pl5-wifi';
        case 'hopkins':
            location = 'Pizza Luce VI - Hopkins';
            captured = 'pl6-wifi';
        case 'richfield':
            location = 'Pizza Luce VII - Richfield';
            captured = 'pl7-wifi';
        case 'roseville':
            location = 'Pizza Luce VIII - Roseville';
            captured = 'pl8-wifi';
        case 'edenprairie':
            location = 'Pizza Luce IX - Eden Prairie';
            captured = 'pl9-wifi';
        case 'events':
            location = 'Pizza Luce I - Downtown';
            captured = 'events';
        case 'web':
            location = 'Pizza Luce I - Downtown';
            captured = 'web';
        default:
            
    }
    return request({
        url: `https://marketing.foodtecsolutions.com/publicapi/users/subscribe`,
        body: `{\"name":\"${user.firstName}\",\"email\":\"${user.email}\",\"store\":\"${location}\",\"attributes\":{\"Captured\":\"${captured}\"}}`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Fts-Api-Token": process.env.FT_M_token
        },
        method: "POST"
    }).then((res) => JSON.parse(res))
    .catch((err) => err)
}

exports.validateIt = (req, res, next) => {
    const locations = ['downtown', 'uptown', 'duluth', 'seward', 'stpaul', 'hopkins', 
        'richfield', 'roseville', 'edenprairie', 'events', 'web'];
    
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    const locTest = locations.includes(req.params.locId);
  
    if (locTest === !true){
        res.status(400).send({status: 400, message: 'incorrect :locId parameter'});
    } else if (!firstName || !lastName || !email) {
        res.status(400).send({status: 400, message: 'incomplete request body'});
    } else if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string') {
        res.status(400).send({status: 400, message: 'request body parameters must be strings'});
    } else if (emailIsValid(email)!== true) {
        res.status(400).send({status: 400, message: 'email parameter incorrect format'});
    } else {
        next()
    }      
    
    function emailIsValid(email){
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
    }
    
}

exports.authenticate = (req, res, next) => {
    if (req.get('token') === process.env.KEY){
        next()
    } else {
        res.status(401).send({status: 401, message: 'unauthorized'})
    }
    
}