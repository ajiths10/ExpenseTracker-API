const User = require("../models/user");
const Expenses = require('../models/expenses');

exports.getAllUsers = async(req, res, next) => {
    const allUsers = await User.findAll()
    res.json({
        message: "All users fetched",
        response: allUsers,
        type: 1,
      });
}