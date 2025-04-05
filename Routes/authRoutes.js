const router = require('express').Router();
const Controller = require("../controller/authController")

router.post('/register', Controller.register);
router.post('/login', Controller.login);
router.post('/verify', Controller.verify);
router.delete('/:email', Controller.delete);
// router.post('/bhoot/:email', Controller.bhoot);

module.exports = router;