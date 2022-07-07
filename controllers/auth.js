const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.postSignUp = async (req, res, next) => {
  let email = req?.body?.email ? req.body.email : 0;
  let name = req?.body?.name ? req.body.name : 0;
  let password = req?.body?.password ? req.body.password : 0;
  let storedHash;

  try {
    const emailExists = await User.findOne({ where: { email: email? email : '' } });

    if (!email || !name || !password) {
      res.json({ message: "Please input correctly!", type: 0 });
    } else if (emailExists) {
      res.json({ message: "Email already registered" , type: 0 });
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
            })
        }
      );

      //To check the password
      //   bcrypt.compare(password, storedHash, function(err, result) {
      //     res.json({
      //         message: "User Created successfully",
      //         response: storedHash,
      //         result: result,
      //         check: storedHash == result
      //       });
      // });

      await res.json({
        message: "User Created successfully",
        response: response,
        type: 1,
      });
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};
