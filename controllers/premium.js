const User = require("../models/user");
const Expenses = require("../models/expenses");
const AWS = require('aws-sdk');

function uploadToS3 (data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM__USER_SECRET = process.env.IAM__USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM__USER_SECRET,
    //Bucket: BUCKET_NAME 
  })

  s3bucket.createBucket(()=>{
    var params = {
      Bucket : BUCKET_NAME,
      Key: filename,
      Body: data
    }
    s3bucket.upload(params, (err, s3response) => {
      if(err) {
        console.log('Something went wrong', err);
      } else {
        console.log('success', s3response);
      }
    } )
  })
}


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

exports.reportDownload = async(req, res) => {
  try {
    const expensesList = await Expenses.findAll({
      where: {
        userId: req.user.id,
      },
    })
    const stringifiedExpenses = JSON.stringify(expensesList);
    const filename = "Expense.txt";
    const fileUrl = uploadToS3(stringifiedExpenses, filename);
    res.json({
      message: "All users fetched",
      response: fileUrl,
      type: 1,
    });

  
  }  catch (err) {
    console.log(err);
    res.json({ message: "Internal Server Error", type: 0, response: err });
  }
  }