const express = require('express');

const auth = require('../controllers/auth');

const router = express.Router();

router.post('/user/signup',auth.postSignUp);

module.exports = router;