const User = require('../models/user');
const Visit = require('../models/visit')
const mongoose = require('mongoose');

mongoose.Promise = Promise;

exports.getAllVisits = (req, res) => {
    let visitPromise = 
    Visit.find({})
        .then((visits) => visits)
        .catch((err) => {
            res.status(500).send(err)
        })
    
        visitPromise.then((allVisits) => {
            res.json(allVisits)
        })
}

exports.getVisitById = (req, res) => {
    let visitPromise = 
    Visit.findById(req.params.visitId)
    .then((visit) => visit)
    .catch((err) => {
        res.status(500).send(err)
    });

    visitPromise.then((visit) => {
        res.json(visit)
    })
}