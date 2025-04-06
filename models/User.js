const mongoose = require('mongoose');

//Create s Schema which represents the model of the user.
const userSchema = new mongoose.Schema({   
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    age: {
        type: Number,
        max: 100,
        min: 5
    },
    otp: {
        type: String,
        max: 6,
        min: 6
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpExpires: {
        type: Date,
        default: false
    },
    isDeleted: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);