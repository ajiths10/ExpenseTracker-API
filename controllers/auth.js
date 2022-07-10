const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');

function generateAccessToken(id) {
  return jwt.sign(id, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
}

exports.postSignUp = async (req, res, next) => {
  let email = req?.body?.email ? req.body.email : 0;
  let name = req?.body?.name ? req.body.name : 0;
  let password = req?.body?.password ? req.body.password : 0;
  let storedHash;

  try {
    const emailExists = await User.findOne({
      where: { email: email ? email : "" },
    });

    if (!email || !name || !password) {
      res.json({ message: "Please input correctly!", type: 0 });
    } else if (emailExists) {
      res.json({ message: "Email already registered", type: 0 });
    } else {
      //encrypt your password
      const response = await bcrypt.hash(
        password,
        saltRounds,
        function (err, hash) {
          console.log(hash);
          storedHash = hash;
          User.create({
            name: name,
            email: email,
            password: storedHash,
          });
        }
      );

      await res.json({
        message: "User Created successfully",
        response: response,
        type: 1,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: "Internal Server Error", type: 0, response: err });
  }
};

exports.postLogin = async (req, res, next) => {
  let email = req?.body?.email ? req.body.email : 0;
  let password = req?.body?.password ? req.body.password : 0;

  try {
    const emailExists = await User.findOne({
      where: { email: email ? email : "" },
    });

    if (!emailExists) {
      res.json({
        message: "no Email found!!",
        response: false,
        type: 0,
      });
    } else {
      await bcrypt.compare(password, emailExists.password, (err, result) => {
        if(!result) {
          res.json({
            message: "User Password Incorrect!",
            response: result,
            type: 0,
          });
        } else if(err){
          res.json({
            message: "Internal Server error!",
            response: err,
            type: 0,
          });
        }else{
          const token = generateAccessToken({ id: emailExists.id });
          res.json({
            message: "User Logined successfully",
            response: result,
            jwttoken: token,
            userData: {
              username: emailExists.name,
              email: emailExists.email,
              isPreminum: emailExists.isPreminum
            },
            type: 1,
          });
        }
       
       
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: "Internal Server Error", type: 0, response: err });
  }
};
