const Service = require('../Services/authService')

module.exports.register = async (req, res) => {
    try {
        const payload = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        const result = await Service.register(payload) 
        return res.status(result.status).json(result);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message : 'something went wrong', error: err });
    }
}

module.exports.login = async (req, res) => {
    try {
        const payload = {
            email: req.body.email,
            password: req.body.password
        }
        const result = await Service.authService.login(payload) 
        return res.status(result.status).json({ message: result.message});
    } catch (e) {
        res.status(500).json({message: 'Invalid Passord'});
    }
}

module.exports.verify = async (req, res) => {
    try {
        const payload = {
            email: req.body.email,
            otp: req.body.otp
        }
        const result = await Service.verifyOTP(payload) 
        return res.status(result.status).json(result);
    } catch (e) {
        res.status(500).json({message: 'Invalid OTP'});
    }
}

// delete
module.exports.delete = async (req, res) => {
    try {
        const payload = {
            email: req.body.email,
            password: req.body.password
        }
        await Service.authService.delete(payload) 
        return res.status(400).json({ message: "Account deleted successfully"});
    } catch (e) {
        res.status(500).json({message: 'Invalid Passord'});
    }
}
