const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");
dotenv.config();
<<<<<<< HEAD
const auth = require('./Authentication/auth');
const classroom=require('./Routes/Classroom');
const user=require('./Routes/User')
const files=require('./Routes/Files');
=======
const auth = require("./Authentication/auth");
const classroom = require("./Routes/Classroom");
const user = require("./Routes/User");
>>>>>>> 3f87743dc4a2281d2fc30935766c6e10cee363d4

app.use(express.json());

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

<<<<<<< HEAD
app.use('/auth', auth);
app.use('/Classroom',classroom);
app.use('/User',user);
app.use('/Files',files);
=======
app.use(allowCrossDomain);
>>>>>>> 3f87743dc4a2281d2fc30935766c6e10cee363d4

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
