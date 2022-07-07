const User = require("../models/user");

exports.postSignUp = (req, res, next) => {
  let email = req?.body?.email ? req.body.email : 0;
  let name = req?.body?.name ? req.body.name : 0;
  let password = req?.body?.password ? req.body.password : 0;

  if (!email || !name || !password) {
    res.json({ message: "Please input correctly!" });
  } else {
    console.log({ message: { email: email, password: password, name: name } });
    User.create({
      email: email,
      password: password,
      name: name,
    })
      .then((response) => {
        res.json({
          message: "User Created successfully",
          response: response,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  }
};
