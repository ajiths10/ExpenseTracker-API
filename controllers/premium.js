const User = require("../models/user");
const Expenses = require("../models/expenses");

exports.getAllUsers = async (req, res, next) => {
  const allUsers = await User.findAll();
  res.json({
    message: "All users fetched",
    response: allUsers,
    type: 1,
  });
};

exports.postReport = async (req, res, next) => {
  const startDate = req.body.Startdate;
  const endDate = req.body.Enddate;
  try{
    const ExpensesList = await Expenses.findAll({
      where: {
        // createdAt: {
        //     [Op.lt]: new Date(new Date(endDate).getTime() + 60 * 60 * 24 * 1000 - 1),
        //     [Op.gt]: new Date(startDate)
        // },
        userId: req.user.id,
      },
    });
  
    res.json({
      message: "All users fetched",
      response: ExpensesList,
      type: 1,
    });

  } catch (err) {
    console.log(err);
    res.json({ message: "Internal Server Error", type: 0, response: err });
  }
};
