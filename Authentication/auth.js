const express = require('express');
const Router = express.Router();
const transporter = require('./emailauth');
const dotenv = require('dotenv').config();
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const app = express();
const User = require('../Models/UserModel');

app.use(express.json());
let otp = Math.random();


Router.post('/signin', (req, res) => {

  var user = req.body;
  if (user.Email == "" || user.Password == "") {
    return res.status(401).send(JSON.stringify({ "error": "Please Add All the Fields", "success": "" }));
  }
  else {
    var hash = bcrypt.hashSync(user.Password, 8);
    console.log(hash)
    var orignalpwd = bcrypt.compareSync(user.Password, hash);
    return res.status(200).send(JSON.stringify({ "error": "", "success": "Success", "hash": hash, "pwd": orignalpwd }))
  }
})




Router.post('/signup', async (req, res) => {

  const user = req.body;
  const { Email, Password } = req.body;

  if (user.Email == "" || user.Password == "") {
    return res.status(401).send(JSON.stringify({ "error": "Please Add All the Fields", "success": "" }));
  }
  else {

    var hash = bcrypt.hashSync(user.Password, 8);
    User.findOne({ Email }, (err, user) => {
      if (user) {
        return res.send(JSON.stringify({ "error": "User Already Exist", "success": "" }));
      }
      else {
        let student = new User({ Email: Email, Password: hash });
        student.save((err) => {
          if (err) {
            return res.send(JSON.stringify({ "error": "Server is Out of Reach", "success": "" }));
          }
          else {

            return res.send(JSON.stringify({ "error": "", "success": "Successfully Created Account" }));
          }
        })
      }
    })
  }
})




Router.post('/confirmation', (req, res) => {

  let mailOptions = {
    from: process.env.EMAIL,
    to: req.body.to,
    subject: 'testing',
    text: 'IT works'
  }

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err.message);
      res.send(err.message)
    }

    else {
      console.log("Message Sent");
      res.send("message Send")
    }
  })
})

module.exports = Router;

