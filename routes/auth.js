const express = require('express');

const auth = require('../controllers/auth');
const expenses = require('../controllers/expense');

const router = express.Router();

const User = require("../models/user");
const jwt = require('jsonwebtoken');

const authenticate = async(req, res, next) => {
    const token = req.header('authorization');
    try{

        await Number(jwt.verify(token, process.env.TOKEN_SECRET , async(err, user) => {
            console.log('Auth error -',err)
        
            if (err) {
               return res.json({
                    message: "Login expires, Please login",
                    response: err,
                    type: 0,
                  });
            }

            const fetchedUser =  await User.findByPk(user.id)
              req.user = fetchedUser;

            next()
          }));
       
    }catch (err){console.log(err)}
}

router.post('/user/signup',auth.postSignUp);
router.post('/user/login',auth.postLogin);

router.post('/api/addexpense',authenticate,expenses.postExpenses)

module.exports = router;