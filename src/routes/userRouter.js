const router = require('express').Router();

const userCtrl = require('../controller/userCtrl')

router.post('/', userCtrl.registerUser)
router.post('/login', userCtrl.loginUser)

module.exports = router