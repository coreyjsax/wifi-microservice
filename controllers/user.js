const User = require('../models/user');
const Visit = require('../models/visit')
const mongoose = require('mongoose');

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
        location: req.params.locId,
        date: Date.now()
    }

    let userPromise = 
        
        User.find({email: req.body.email})
            .exec()
            .then((user) => user)
            .catch((err) => err);

    userPromise.then((userMatches) => {
        
        if (userMatches.length < 1) {
            
            let newUser = new User(newUserData);
            let newVisit = new Visit(visit);
           
            newUser.visits.push(newVisit);
            newUser.save((err, user) => {
                if(err){
                    res.status(500).send(err)
                }

               res.status(201).send({status: 201, data: user})
          
            })
      
        } else {
            
            let user = userMatches[0];
            let id = user._id
            let userEmail = user.email;
            let visit = {
                ip: req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress,
                location: req.params.locId,
                date: Date.now()
            }

            User.findById(id, (err, user) => {

                Visit.create(visit, (err, userVisit) => {
                    userVisit.save();
                    user.visits.push(userVisit);
                    user.save();
                    res.status(200).send({status: 201, message: `user updated`, data: user});
                })
            })
        }
    });   
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
        res.json(allUsers)
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
        res.json(allUsers)
    })
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
        res.json(user);
    })
}

exports.searchUsers = (req, res) => {
    User.find()
    .populate('visits')
    .exec((err, docs) => {
        
    })
}