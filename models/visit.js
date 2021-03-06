 const mongoose = require('mongoose');

 const VisitSchema = new mongoose.Schema({
         location: String,
         ip: String,
         mac: String,
         date: {
             type: Date, default: Date.now
         }
 })

 module.exports = mongoose.model('Visit', VisitSchema);