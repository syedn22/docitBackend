const dotenv = require('dotenv').config();
const jwt=require('jsonwebtoken');


const authenticateToken=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
  
    if(token==null)
    res.status(400).send('Invalid User');
    jwt.verify(token,process.env.SECRET_KEY,(err,data)=>{
      if(err)
      {
        return res.sendStatus(401)
      }
  
      req.user=data;
      //console.log(req.user)
      next();
    })
  
  }
  
module.exports.authenticateToken=authenticateToken;