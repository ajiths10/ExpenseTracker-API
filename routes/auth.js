const express = require('express');

const auth = require('../controllers/auth');
const expenses = require('../controllers/expense');

const router = express.Router();

const jwt = require('jsonwebtoken');

const authenticate = async(req, res, next) => {
    const token = req.header('authorization');
    try{

        await Number(jwt.verify(token, process.env.TOKEN_SECRET ,(err, user) => {
            console.log('Auth error -',err)
        
            if (err) return res.sendStatus(403)
            req.userId = user
        
            next()
          }));
       
    }catch (err){console.log(err)}
}

router.post('/user/signup',auth.postSignUp);
router.post('/user/login',auth.postLogin);

router.post('/addexpense',authenticate,expenses.postExpenses)

module.exports = router;