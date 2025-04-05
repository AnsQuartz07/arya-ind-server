const router = require("express").Router();
const User = require("../Models/User");
const mongoose = require("mongoose");
const sendOTP = require("../utils/sendEmail");
const bcrypt = require("bcrypt")

module.exports.register = async (payload) => {
    try {
        const existing = await User.findOne({ email: payload.email });

        if (existing) return {status: 409, message: 'User already exists'};
    
        const hashed = await bcrypt.hash(payload.password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
    
        const user = new User({ name: payload.name, email: payload.email, password: hashed, otp, otpExpires });
        await user.save();
    
        await sendOTP(payload.email, otp);
    
        return {status: 200, message: "Check your email for an otp to verify your email. If it doesn't appear within a few minutes, check your spam folder." };
    } catch (err) {
        console.log(err)
        throw Error (err)
    }
}

module.exports.verifyOTP = async (payload) => {
    try {
        const { email, otp } = payload;
        const user = await User.findOne({ email });
    
        if (!user) return {status: 404, message: 'User not found' };
        if (user.isVerified) return {status: 409,  message: 'User already verified' };
        if (user.otp !== otp || user.otpExpires < Date.now())
            return {status: 400, message: 'Invalid or expired OTP' };
    
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
    
        return { status: 200, message: 'Email verified successfully' };
    } catch (err) {
        console.log(err)
        throw Error (err);
    }
  };