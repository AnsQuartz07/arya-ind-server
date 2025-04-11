const router = require('express').Router();
const Controller = require("../controller/authController")

router.post('/register', Controller.register);
router.post('/login', Controller.login);
router.post('/verifyOtp', Controller.verifyOtp);
router.get('/get-lectures', Controller.authenticateToken, Controller.getLectures);
router.delete('/:email', Controller.delete);

module.exports = router;