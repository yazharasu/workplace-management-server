const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpVerificationSchema = new Schema( {
    email: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date
})

const otpVerification = mongoose.model( 'otpVerification', otpVerificationSchema);
module.exports = otpVerification;
