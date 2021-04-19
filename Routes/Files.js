const multer=require('multer');
const fs=require('fs');
const express = require('express');
const Router = express.Router();
const {postFiles,listAllFiles,downloadFile, deleteFile,listFilestoStaff_Studentid} =require('../Controller/FilesController');
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
		Class=await Classroom.findById(req.user.Classrooms[0]) 
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
      console.log(req.body);
        cb(null, file.fieldname + '_'+ Date.now()+'_'+file.originalname+'_'+path.extname(file.originalname))
  }
});
const fileUpload = multer({
  storage: fileStorage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.docx' && ext !== '.pdf' && ext !== '.txt') {
        return callback(new Error('Only pdf,doc and txt  are allowed'))
    }
    callback(null, true)
},
  limits: { fileSize: 2000000 }
}
)

const middlewarefile=(req,res,next)=>{
  fileUpload.array('file',10)(req,res,(err)=>{
      if(err)
      {
        if(err.message==="File too large")
        {
          return res.status(404).send(err.message+" Max size is 2MB")
        }
        return res.status(404).send(err.message)
      }
      next();
  })
}


Router.post('/upload',authenticateToken,middlewarefile,postFiles);

Router.get('/getfiles',authenticateToken, listAllFiles);

Router.get('/download/:id',authenticateToken,downloadFile);

Router.post('/Staff/getfiles',authenticateToken,listFilestoStaff_Studentid)


Router.delete('/:id',authenticateToken,deleteFile);



  module.exports=Router;