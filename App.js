const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 7777;

const sequelize = require("./util/database");

const user = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

console.log("Hello World");


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
