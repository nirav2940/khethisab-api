const express = require("express");
const app = express();
const con = require("./config/database");

const user = require("./api/routes/user");
const crop = require("./api/routes/crop");
const kharcho = require("./api/routes/kharcho");
const vechan = require("./api/routes/vechan");
const majuri = require("./api/routes/majuri");
const notification = require("./api/routes/notification");

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

setInterval(function () {
  con.query("SELECT 1");
}, 10000);

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/user", user);
app.use("/crop", crop);
app.use("/kharch", kharcho);
app.use("/vechan", vechan);
app.use("/majuri", majuri);
app.use("/notification", notification);
app.get("/version", function (req, res) {
  res.status(200).send({ version: 6 });
});

app.get("/", function (req, res) {
  res.status(200).send("This is Khedut-App Api....!");
});

module.exports = app;
