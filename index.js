const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");
dotenv.config();
const auth = require("./Authentication/auth");
const classroom = require("./Routes/Classroom");
const user = require("./Routes/User");
const Fawn = require("fawn");

Fawn.init(mongoose);

app.use(express.json());

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);

const connectionstring = `mongodb+srv://Hariharan:${process.env.MONGODB_PASSWORD}@cluster0.kxkqd.mongodb.net/CollegeProject?retryWrites=true&w=majority`;

mongoose
  .connect(connectionstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected Successfully To mongodb");
  })
  .catch((e) => {
    console.log(e);
  });

app.use("/auth", auth);
app.use("/Classroom", classroom);
app.use("/User", user);

app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(process.env.PORT, () => {
  console.log("Port is created in", process.env.PORT);
});
