const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 7777;
let token ;

const sequelize = require("./util/database");

//models
const User = require('./models/user');
const Expenses = require('./models/expenses');

//To generate a token for jwt
// require('crypto').randomBytes(48, function(err, buffer) {
//    token = buffer.toString('hex');
//    console.log(token)
// });

//routes
const auth = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

console.log("Hello World");
app.use('/auth', auth)

Expenses.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Expenses);

sequelize
  .sync()
  .then((e) => {
    // console.log(e);
    app.listen(port);
  })
  .then((e) => console.log(`${port} - port running`))
  .catch((err) => {
    console.log(err);
  });
