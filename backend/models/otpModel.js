const mongoose = require("mongoose");


const otpSchema = new mongoose.Schema(
  {
    email: { 
        type: "String", 
        // unique: true, 
        required: true 
    },
    otp:  {
        type : Number, 
    },
    expireAt: {
        type : Date,
        default:Date.now,
        index: {expires : '5m'}
    }
  },
  { timestaps: true }
);

const Otp = mongoose.model('Otp',otpSchema) ;

module.exports = Otp ;