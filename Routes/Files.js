const multer=require('multer');
const fs=require('fs');
const express = require('express');
const Router = express.Router();
const {postFiles,listAllFiles,downloadFile} =require('../Controller/FilesController');
const app = express();
const path=require('path');

app.use(express.json());
app.use(multer);

const fileStorage = multer.diskStorage({
  // Destination to store image     
  destination: (req,file,cb)=>{
   console.log(req.params.RegisterNo)
   var Reg=req.params.RegisterNo;
   const dest= 'public/upload/'+Reg;
   console.log(dest)
   fs.access(dest, function (error) {
    if (error) {
      console.log("Directory does not exist.");
      return fs.mkdir(dest, (error) => cb(error, dest));
    } else {
      console.log("Directory exists.");
      return cb(null, dest);
    }
  });
  }, 
    filename: (req, file, cb) => {
      console.log(file.originalname);
        cb(null, file.fieldname + '_'+ Date.now()+'_'+file.originalname)
  }
});
const fileUpload = multer({
  storage: fileStorage
}
)


Router.post('/upload/:RegisterNo',fileUpload.single('file'),(req, res) => {

  if(req.file)
  {
    res.send(req.file);
    res.end("File is uploaded successfully!"); 
  }
  else{
    res.send('Please Upload a File');
  }
     
});
  

Router.get('/getfiles/:RegisterNo', listAllFiles);

Router.get('/download/:filename',downloadFile);



  module.exports=Router;