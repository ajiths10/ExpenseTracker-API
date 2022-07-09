const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');

exports.postExpenses = async(req, res, next) => {
    res.json({
        message: "JWT token",
        response: req.userId,
        type: 1,
      });
}