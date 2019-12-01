var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Customer = new Schema({
    fname: String,
    lname: String,
    gender: String,
    username: String,
    password: String,
    role: Boolean
});

Customer.plugin(passportLocalMongoose);

module.exports = mongoose.model('Customer', Customer);
