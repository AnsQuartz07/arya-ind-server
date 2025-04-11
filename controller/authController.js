const User = require('../models/User');
const Service = require('../Services/authService')
const jwt = require('jsonwebtoken');
module.exports.register = async (req, res) => {
    try {
        const payload = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isResend: req.body.isResend
        }
        const result = await Service.register(payload) 
        return res.status(result.status).json(result);
    } catch (e) {
        console.log("Internal Server Error [register] ", e)
        res.status(500).json(e.message);
    }
}

module.exports.login = async (req, res) => {
    try {
        const payload = {
            email: req.body.email,
            password: req.body.password
        }
        const result = await Service.login(payload) 
        return res.status(result.status).json(result);
    } catch (e) {
        console.log("Internal Server Error [login] ", e)
        res.status(500).json(e.message);
    }
}

module.exports.verifyOtp = async (req, res) => {
    try {
        const payload = {
            email: req.body.email,
            otp: req.body.otp
        }
        const result = await Service.verifyOtp(payload) 
        return res.status(result.status).json(result);
    } catch (e) {
        console.log("Internal Server Error [verifyOtp] ", e)
        res.status(500).json(e.message);
    }
}

// jwt token authentication
module.exports.authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({status: 401, message: 'Access denied. No token provided.' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        console.log("Internal Server Error [authenticateToken] ", e );
        res.status(400).json(e.message);
    }
}

module.exports.getLectures = async (req, res) => {
    try {
        const moduleId = req.query.moduleId;
        const result = await Service.getLectures(moduleId)
        res.status(result.status).json(result);
    } catch (e) {
        console.log("Internal Server Error [getLectures] ", e );
        res.status(500).json(e.message)
    }
}
// delete
module.exports.delete = async (req, res) => {
    try {
        // const payload = {
        //     email: req.body.email,
        //     password: req.body.password
        // }
        await User.deleteOne({email: req.params.email});
        // await Service.authService.delete(payload) 
        return res.status(400).json({ message: "Account deleted successfully"});
    } catch (e) {
        console.log('eeeeeeee', e)
        res.status(500).json({message: 'Invalid Passord'});
    }
}
