const express = require('express');
const Router = express.Router();
const dotenv = require("dotenv").config();
const CryptoJS=require('crypto-js');
const app = express();
const {User} = require('../Models/UserModel');
const jwt=require('jsonwebtoken');
const {authenticateToken}=require('./authtoken');
const transporter=require('./emailauth');
app.use(express.json());



Router.post('/signin',async (req, res) => {

  var usercredentials = req.body;
  if (usercredentials.Email == "" || usercredentials.Password == "") {
    return res.status(401).send(JSON.stringify({ "error": "Please Add All the Fields", "success": "" }));
  }
  else {
    const user=await User.findOne({$or:[{Email:usercredentials.Email},{RegisterNo:usercredentials.RegisterNo}]});
    
    if(user)
    {
      console.log(user)

      var bytes  = CryptoJS.AES.decrypt(user.Password, process.env.SECRET_KEY);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);

      console.log(originalText)
      if(originalText===JSON.stringify(usercredentials.Password))
      {
        const plainuser=JSON.stringify(user);
        const token=jwt.sign(plainuser,process.env.SECRET_KEY);
        return res.status(200).send(token);
      }
      else{
        return res.send("User credentials are wrong");
      }
     
    }
    else{
      return res.send("User Credentials are wrong");
    }

   return res.status(401).send('Invalid User');
  }
})

Router.post('/forgetPassword',async (req,res)=>{
  var usercredentials = req.body;
  if (usercredentials.Email == "") {
    return res.status(401).send(JSON.stringify({ "error": "Email Field is Empty", "success": "" }));
  }
  else {
    const user=await User.findOne({Email:usercredentials.Email});
    if(user)
    {
      var bytes  = CryptoJS.AES.decrypt(user.Password, process.env.SECRET_KEY);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);

      console.log(originalText)
      var mailOptions = {
        from: 'mytestnetworklab@gmail.com',
        to: user.Email,
        subject: 'Forget Password from Docit',
        text: originalText
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(422).send("Email Not Sent");
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send("Email Sent");
        }
      });
    }

  }
})



Router.get('/resource',authenticateToken,(req,res)=>{
  res.send(req.user);
})


module.exports = Router;

