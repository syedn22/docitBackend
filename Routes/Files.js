const multer=require('multer');
const fs=require('fs');
const express = require('express');
const Router = express.Router();
const {postFiles,listAllFiles,downloadFile, deleteFile} =require('../Controller/FilesController');
const app = express();
const path=require('path');
const {User}=require('../Models/UserModel');
const {authenticateToken}=require('../Authentication/authtoken');
const {Classroom}=require('../Models/ClassroomModel');

app.use(express.json());
app.use(multer);

const fileStorage = multer.diskStorage({  
  destination: async(req,file,cb)=>{
    let Class="";
		Class=await Classroom.findById(req.user.Classroom[0]) 
   const dest= 'public/upload/'+Class.Name+'/'+req.user.RegisterNo;
   fs.access(dest, function (error) {
    if (error) {
      console.log("Directory does not exist.");
      return fs.mkdir(dest, (error) => cb(error, dest));
    } else {
      console.log("Directory exists.");
      return cb(null,dest);
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


Router.post('/upload',authenticateToken,fileUpload.array('file',10),postFiles);

Router.get('/getfiles',authenticateToken, listAllFiles);

Router.get('/download/:filename',authenticateToken,downloadFile);


Router.delete('/:id',authenticateToken,deleteFile);



  module.exports=Router;