const User = require('../models/user');
const Visit = require('../models/visit')
const mongoose = require('mongoose');
const tools = require('../util/tools')

mongoose.Promise = Promise;

exports.findOrCreateUser = (req, res) => {
   
    let newUserData = {
        name: {
            first: req.body.firstName,
            last: req.body.lastName
        },
        email: req.body.email
    }
    
    let visit = {
        ip: req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress,
        mac: req.body.mac,
        location: req.params.locId,
        date: Date.now()
    }

    let getUser = User.find({email: req.body.email}).exec();
    let ftReq = tools.addUserToEmailList(req.body, req.params.locId);

    Promise.all([getUser, ftReq])
    .then(([userMatches, ftRes]) => {
        
        let ftResCode = '';
        let ftResMessage = '';

        if (ftRes.meta){
            ftResCode = ftRes.meta.code;

            if (ftResCode === 200){
                ftResMessage = ` has been added to FT email list`;
            } else {
                ftResMessage = ftRes.meta.info;
            }

        } else if (ftRes.statusCode){
            let ftMsg = JSON.parse(ftRes.body);
            
            ftResCode = ftRes.statusCode;
            ftResMessage = ftMsg.meta.info;
        }

        if (userMatches.length < 1){
            let newUser = new User(newUserData);
            let newVisit = new Visit(visit);
            
            newVisit.save()
            newUser.visits.push(newVisit);
            newUser.save((err, user) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(201).send({status: 201, user: user, ftStatus: {status: ftResCode, msg: ftResMessage}})
            })

        } else {

            let matchedUser = userMatches[0];
            let id = matchedUser._id;
            
            User.findById(id, (err, user) => {

                Visit.create(visit, (err, userVisit) => {
                    userVisit.save();
                    user.visits.push(userVisit);
                    user.save();
                    if (err) {
                        res.status(500).send(err);
                    }
                    res.status(201).send({status: 201, user: user, ftStatus: {status: ftResCode, msg: ftResMessage}})
                })
            })
        }
    })
}



exports.getAllUsersFull = (req, res) => {
    
    let userPromise = 
        User.find({})
        .populate('visits').exec()
        .then((users => users))
        .catch((err) => {
            res.status(500).send(err)
        });

    userPromise.then((allUsers) => {
        if (!allUsers){
            res.status(404).send({status: 404, message: 'users not found'});
        } else {
            res.json(allUsers)
        }
    })
}

exports.getAllUsers = (req, res) => {
    
    let userPromise = 
        User.find({})
            .then((users => users))
            .catch((err) => {
                res.status(500).send(err)
            });

    userPromise.then((allUsers) => {
        if (!allUsers){
            res.status(404).send({status: 404, message: 'users not found'});
        } else {
            res.json(allUsers)
        }
    });
}

exports.getUserById = (req, res) => {
    let userPromise =
        User.findById(req.params.userId)
            .populate('visits')
            .then((user) => user)
            .catch((err) => {
                res.status(500).send(err)
        });

    userPromise.then((user) => {
        if (!user) {
            res.status(404).send({status: 404, message: 'user not found'});
        } else {
            res.json(user);
        }
    }).catch((err) => {
        res.status(400).send({status: 400, message: err});
    })
}

exports.searchUsers = (req, res) => {
    User.find()
    .populate('visits')
    .exec((err, docs) => {
        
    })
}

exports.config = (req, res) => {
    return tools.ftConfig()
    .then((data) => res.json(data))
    .catch((err) => err)
}
