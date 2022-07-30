const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const https = require("https");

const app = express();
const port = 7777;
let token;

const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

const sequelize = require("./util/database");

//models
const User = require("./models/user");
const Expenses = require("./models/expenses");
const ForgotPassword = require("./models/ForgotPassword");
const ReportDownloaded = require("./models/ReportDownloaded");
//To generate a token for jwt
// require('crypto').randomBytes(48, function(err, buffer) {
//    token = buffer.toString('hex');
//    console.log(token)
// });

//routes
const auth = require("./routes/auth");
const path = require("path");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(compression());

console.log("Hello World");
app.use("/auth", auth);

Expenses.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Expenses);

ForgotPassword.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(ForgotPassword);

ReportDownloaded.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(ReportDownloaded);

sequelize
  .sync()
  .then((e) => {
    // console.log(e);
    app.listen(process.env.PORT || port);
    //   https
    //     .createServer({ key: privateKey, cert: certificate }, app)
    //     .listen(process.env.PORT || port);
  })
  .then((e) => console.log(`${process.env.PORT || port} - port running`))
  .catch((err) => {
    console.log(err);
  });
