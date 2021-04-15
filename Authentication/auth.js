const express = require('express');
const Router = express.Router();
const bcrypt = require('bcryptjs');
const app = express();
const {User} = require('../Models/UserModel');
const jwt=require('jsonwebtoken');
const {authenticateToken}=require('./authtoken');
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
      var originalpwd = bcrypt.compareSync(usercredentials.Password,user.Password);
      console.log(originalpwd);
      if(originalpwd)
      {
        const plainuser=JSON.stringify(user);
        const token=jwt.sign(plainuser,process.env.SECRET_KEY);
        return res.status(200).send(token);
      }
      else{
        res.send("User credentials are wrong");
      }
     
    }
    else{
      res.send("User Credentials are wrong");
    }

    res.status(401).send('Invalid User');
  }
})



Router.get('/resource',authenticateToken,(req,res)=>{
  res.send(req.user);
})


module.exports = Router;

