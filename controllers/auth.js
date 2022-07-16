const User = require("../models/user");
const ForgotModel = require("../models/ForgotPassword");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

function generateAccessToken(id) {
  return jwt.sign(id, process.env.TOKEN_SECRET, { expiresIn: "3600s" });
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
      const newUuId = await uuidv4();
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
            uuid: newUuId,
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
        message: "No Email found!!",
        response: false,
        type: 0,
      });
    } else {
      await bcrypt.compare(password, emailExists.password, (err, result) => {
        if (!result) {
          res.json({
            message: "User Password Incorrect!",
            response: result,
            type: 0,
          });
        } else if (err) {
          res.json({
            message: "Internal Server error!",
            response: err,
            type: 0,
          });
        } else {
          const token = generateAccessToken({ id: emailExists.id });
          res.json({
            message: "User Logined successfully",
            response: result,
            jwttoken: token,
            userData: {
              username: emailExists.name,
              email: emailExists.email,
              isPreminum: emailExists.isPreminum,
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

exports.userVerify = async (req, res, next) => {
  console.log(req.user);
  res.json({
    message: "User Authenticated",
    response: req.user,
    type: 1,
  });
};

exports.forgotPassword = async (req, res, next) => {
  let email = req?.body?.email ? req.body.email : 0;

  if (!email) {
    return res.json({
      message: "Please enter your email address!!",
      response: false,
      type: 0,
    });
  }

  try {
    const emailExists = await User.findOne({
      where: { email: email ? email : "" },
    });

    if (!emailExists) {
      res.json({
        message: "No Email found!!",
        response: false,
        type: 0,
      });
    } else {
      const newUuId = await uuidv4();
      const generateResponse = emailExists.createForgotPassword({
        isActive: 1,
        userUuId: emailExists.uuid,
        ForgotPasswordID: newUuId,
      });
      console.log(generateResponse);
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"admin 👻" <admin@email.com>', // sender address
        to: emailExists.email, // list of receivers
        subject: "Forgot Password reset Link", // Subject line
        text: `Forgot Password reset Link`, // plain text body
        html: `<a href="http://localhost:7777/auth/user/forgotpassword/${emailExists.uuid}"> Reset password</a>`, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      const triggeredURl = nodemailer.getTestMessageUrl(info);
      console.log("Preview URL: %s", triggeredURl);
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      res.json({
        message: "Reset mail sent success",
        url: triggeredURl,
        genrateresponse: generateResponse,
        type: 1,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: "Internal Server Error", type: 0, response: err });
  }
};

exports.forgotPasswordReset = async (req, res) => {
  console.log(req.params.id);
  const userExists = await ForgotModel.findOne({
    where: { userUuId: req.params.id ? req.params.id : "" },
  });
  if (!userExists) {
    res.send(`<html><h1>Invalid user or link !!</h1><html>`);
  } else {
    res.status(200).send(`<html>
                            <script>
                                function formsubmitted(e){
                                   e.preventDefault();
                                       console.log('called')
                                        }
                                    </script>
                                    <form action="/auth/user/forgotpassword/update/${req.params.id}" method="post">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                          </html>`);
  }
};

exports.forgotPasswordUpdate = async (req, res) => {
  const password = req.body.newpassword;

  const userExists = await ForgotModel.findOne({
    where: { userUuId: req.params.id ? req.params.id : "" },
  });
  if (!userExists) {
    res.send(`<html>
                <h1>Invalid user or link !!</h1>
              <html>`
            );
  } else {
    const newUuId = await uuidv4();
    const response = await bcrypt.hash(
      password,
      saltRounds,
      function (err, hash) {
        console.log(hash);
        storedHash = hash;

        User.findByPk(userExists.userId)
        .then(fetchedUser => {
          fetchedUser.password = storedHash,
          fetchedUser.uuid = newUuId
          return fetchedUser.save();
        })
        .then(()=>{
          userExists.isActive = 0
          return userExists.save();
        })
        .catch(err => console.log(err));
      }
    );

    res.send(`<html>
    <h1>Success !!</h1>
  <html>`
);
  }
}

