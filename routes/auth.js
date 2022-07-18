const express = require("express");

const auth = require("../controllers/auth");
const expenses = require("../controllers/expense");
const payment = require("../controllers/payment");
const preminum = require("../controllers/premium");

const router = express.Router();

const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const token = req.header("authorization");
  try {
    await Number(
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        console.log("Auth error -", err);

        if (err) {
          return res.json({
            message: "Login expires, Please login",
            response: err,
            type: 0,
          });
        }

        const fetchedUser = await User.findByPk(user.id);
        req.user = fetchedUser;

        next();
      })
    );
  } catch (err) {
    console.log(err);
  }
};

const isPreminum = (req, res, next) => {
  console.log(req.user.isPreminum);
  if (!req.user.isPreminum) {
    return res.json({
      message: "Unauthorized Access!!",
      type: 0,
    });
  } else {
    next();
  }
};

router.post("/user/signup", auth.postSignUp);
router.post("/user/login", auth.postLogin);
router.post("/user/forgotpassword", auth.forgotPassword);
router.get("/user/api/verify", authenticate, auth.userVerify);
router.get("/user/forgotpassword/:id", auth.forgotPasswordReset);
router.post("/user/forgotpassword/update/:id", auth.forgotPasswordUpdate);

router.get("/api/userexpenses", authenticate, expenses.fetchUserExpenses);
router.post("/api/addexpense", authenticate, expenses.postExpenses);
router.post(
  "/api/alluser/expenses",
  authenticate,
  expenses.fetchSpecificUserExpenses
);

router.post("/api/report/expense",authenticate, isPreminum, preminum.postReport);
router.get("/api/getallusers", preminum.getAllUsers);

router.post("/api/payment", authenticate, payment.PostPayment);
router.post("/api/payment/sucess", authenticate, payment.PostPaymentSuccess);

module.exports = router;
