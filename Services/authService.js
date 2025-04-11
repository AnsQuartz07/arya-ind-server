const router = require("express").Router();
const User = require("../models/User");
const Lecture = require("../models/Lecture");
const mongoose = require("mongoose");
const sendOTP = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

module.exports.register = async (payload) => {
    try {
        if(payload.isResend) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
            await sendOTP(payload.email, otp, otpExpires);
            await User.updateOne({email: payload.email}, {$set: {otp, otpExpires}})
        }
        else {
            const existing = await User.findOne({ email: payload.email, isVerified: true, isDeleted: false });
            if (existing) return {status: 409, message: 'User already exists'};
            const hashed = await bcrypt.hash(payload.password, 10);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
            await sendOTP(payload.email, otp);
            const user = new User({ name: payload.name, email: payload.email, password: hashed, otp, otpExpires });
            await user.save();
        }
        return {status: 200, message: "Otp sent successfully" };
    } catch (err) {
        throw Error (err)
    }
}

module.exports.verifyOtp = async (payload) => {
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

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15h' }
        );

        return { status: 200, message: 'Email verified successfully', token , user: {name: user.name, email: user.email} };
    } catch (err) {
        throw Error (err);
    }
};

module.exports.login = async (payload) => {
    try {
        const { email, password } = payload;
        const user = await User.findOne({ email });
        if (!user) return { status: 404, message: 'User not found' };
    
        if (!user.isVerified) {
            return { status: 403, message: 'Email not verified' };
        }
    
        console.log('compare',{ password, bcyp: user.password});
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return { status: 401, message: 'Invalid credentials' };
    
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15h' }
        );
    
        return {
            status: 200,
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        };        
    } catch (err) {
        throw Error (err);
    }
};

module.exports.getLectures = async (moduleId) => {
    try {
        const lectures = await Lecture.find({
            moduleId: moduleId,
            isDeleted: false,
        })
        return {
            status: 200,
            message: 'fetched the lectures successfully',
            data: lectures
        };
    } catch (err) {
        throw Error (err);
    }
};