const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

exports.postExpenses = async (req, res, next) => {

    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
try{

    if(!amount || !category) {
        res.json({
            message: "Invalid request",
            response: "fields are missing!!",
            type: 0,
          });
    }else {
        const createResponse =  await req.user.createExpense({
            amount: amount,
            description: description,
            category: category
        })
        res.json({
            message: "Expense added",
            response: createResponse,
            type: 1,
          });
    }
}catch(err) {
    console.log(err)
    res.json({ message: "Internal Server Error", type: 0, response: err });
}

};
