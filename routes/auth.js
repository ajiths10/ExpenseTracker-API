const express = require('express');

const auth = require('../controllers/auth');

const router = express.Router();

router.post('/user/signup',auth.postSignUp);
router.post('/user/login',auth.postLogin);

module.exports = router;