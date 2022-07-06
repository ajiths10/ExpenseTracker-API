const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 7777;

const sequelize = require('./util/database');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

console.log("Hello World");


app.listen(port);
console.log(`${port} - port running`)
