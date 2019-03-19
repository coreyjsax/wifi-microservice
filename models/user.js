const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    email: String,
    sign_up_store: String,
    visits: [{type: mongoose.Schema.Types.ObjectId, ref: 'Visit'}],
    //Visit: { date, ip, }
})

module.exports = mongoose.model('User', UserSchema);
