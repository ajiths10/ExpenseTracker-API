const User = require("../models/user");
const Expenses = require("../models/expenses");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

exports.postExpenses = async (req, res, next) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  try {
    if (!amount || !category) {
      res.json({
        message: "Invalid request",
        response: "fields are missing!!",
        type: 0,
      });
    } else {
      const createResponse = await req.user.createExpense({
        amount: amount,
        description: description,
        category: category,
      });
      res.json({
        message: "Expense added",
        response: createResponse,
        type: 1,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: "Internal Server Error", type: 0, response: err });
  }
};

exports.fetchUserExpenses = async (req, res, next) => {
  try {
    const rowsPerPage =  req?.body?.rowsPerPage? req.body.rowsPerPage : 10;
    const value = req?.body?.page ? req.body.page : 1;
    const page = Number(value);
    const ITEMS_PER_Page = Number(req.body.rowsPerPage)
    const userExpenses = await Expenses.findAndCountAll({
      offset: (page - 1) * ITEMS_PER_Page,
      limit: ITEMS_PER_Page,
    })

    res.json({
      message: "Expense fetched",
      response: {
        userExpenses: userExpenses,
        currentPage: page,
        nextPage: userExpenses.count / ITEMS_PER_Page > page ? page + 1 : 0,
        previousPage: page - 1,
      },
      type: 1,
    });

  } catch (err) {
    console.log(err);
    res.json({ message: "Internal Server Error", type: 0, response: err });
  }
};

exports.fetchSpecificUserExpenses = async (req, res, next) => {
  try {
    console.log(req.body.id)
    const userExpenses = await Expenses.findAll({
      where: { userId: req.body.id },
    });
    // console.log(userExpenses);
    res.json({
      message: "Expense fetched",
      response: userExpenses,
      type: 1,
    });
  } catch (err) {
    console.log(err);
    res.json({ message: "Internal Server Error", type: 0, response: err });
  }
};

