const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// email, company name, location, no of employees, domain name, first name, last name, password, username
const userSchema =  new Schema( {
    email: {
        type: String,
        maxlength: 25,
        unique: true,
        required: true
    },
    companyName: {
        type: String,
        unique: true,
    },
    location: {
        type: String,
    },
    noOfEmployees: {
        type: Number
    },
    firstName: {
        type: String,
        maxlength: 25
    },
    lastName: {
        type: String,
        maxlength: 25
    },
    password: {
        type: String,
        minlength: 4,
        maxlength: 25
    },
    verified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }

});

const User = mongoose.model( 'User' , userSchema );
module.exports = User;