const fs=require('fs');
const {Files}=require('../Models/fileModel');
const {User}=require('../Models/UserModel');
const {Classroom}=require('../Models/ClassroomModel');
const path=require('path');
const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);
const ObjectID=require('mongodb').ObjectID;


const postFiles=async(req,res,next)=>{

	   try{
		const {RegisterNo,category,date}=JSON.stringify(req.body);
		const reg=parseInt(RegisterNo)

		const Class=await Classroom.findById(req.user.Classrooms[0]) 
		if(!Class) return res.status(400).send("No Class Found");

		let f=[];
       for(let fileobj of req.files)
	   {
		const file=new Files({
			studentId:req.user._id,
			classroomId:Class._id,
			category:req.body.category,
			filepath:fileobj.destination+"/"+fileobj.filename,
			filename:fileobj.filename,
			date:req.body.date
		  })
		  f.push(file);
	   }
      console.log(f)
	   if(f && f.length>=1)
	   {
		   Files.insertMany(f).then((files)=>{
			   return res.status(200).send("Files Uploaded Successfully");
		   })
		   .catch((e)=>{
			   console.log(e.message)
			   return res.status(400).send("Files Not Uploaded Successfully")
		   })
	   }
    
	   }
	   catch(e)
	   {
		   return res.send("Something went wrong");
	   }

}

const listAllFiles =async (req, res) => {

	if(req.user)
	{
		let Class="";
	Class=await Classroom.findById(req.user.Classrooms[0]) 
	const uploadFolder='public/upload/'+Class.Name+'/'+req.user.RegisterNo;
	// fs.readdir(uploadFolder, (err, files) => {
	// 	res.send(files);
	// })

	try{
		const files=await Files.find({studentId:req.user._id});
		return res.status(200).send(files);
	}
	catch(e)
	{
		return res.status(400).send("Something Went Wrong");
	}
	
	}
	else{
		return res.status(200).send('Invalid User Found');
	}  
	
}


const listAllFilestoStaff =async (req, res) => {

	if(req.user.isStaff)
	{
		let files="";
	try{
		console.log(req.params.classroomId)
		files=await Files.find({classroomId:req.params.classroomId}) 
	return res.status(200).send(files)
	}
	catch(e)
	{
		return res.status(400).send(e.message);
	}
	
	}
	else{
		return res.status(200).send('Invalid User Found');
	}  
	
}


const listFilestoStaff_Studentid =async (req, res) => {

	if(req.user.isStaff)
	{
		let files="";
	
	try{
		files=await Files.find({$and:[{classroomId:req.body.classroomId},{studentId:req.body.studentId}]}) ;
		if(!files) return res.status(422).send("No User Files Found");
	return res.status(200).send(files)
	}
	catch(e)
	{
		return res.status(400).send(e.message);
	}
	
	}
	else{
		return res.status(200).send('Invalid User Found');
	}  
	
}




const downloadFile = async (req, res) => {
	
	const downloadfileid=req.params.id;
	if(ObjectID.isValid(downloadFile))
	{
		if(req.user)
		{
			const deletefile=await Files.findById(downloadfileid);
			if(!deletefile) return res.status(400).send('File Not Found');

			const downloadpath=deletefile.filepath;
			const rootpath=path.dirname(__dirname).split('/').pop();
	
			console.log(path.join(rootpath,downloadpath));
			fs.access(path.join(rootpath,downloadpath),(error)=>{
			if (error) {
				console.log("Directory does not exist.");
				return res.status("404").send("File Doesn't exist");
		  	} else {
				return res.download(path.join(rootpath,downloadpath));	
		  	}
		})

		}
		else{
			return res.status(200).send('Invalid User Found');
		}
	} 
	else{
		return res.status(404).send('Invalid FileId is sent');
	} 
}

const deleteFile=async(req,res)=>{

	const deletefileid=req.params.id;
	if(ObjectID.isValid(deletefileid))
	{
	if(req.user)
	{
	const deletefile=await Files.findById(deletefileid);
	if(!deletefile) return res.status(400).send('File Not Found');

	console.log(deletefile)
	const deletepath=deletefile.filepath;
     // console.log(path.join(__dirname,deletepath))
	const rootpath=path.dirname(__dirname).split('/').pop();
	

	fs.unlink(path.join(rootpath,deletepath),async function(err){
		if(err) return res.status(400).send('File is Not delted');

	   const deletedfile=await Files.findByIdAndRemove(deletefileid);

	   if(!deletedfile) return res.status(400).send('File Not Found');

		return res.status(200).send('file deleted successfully');
   });  	
}
else{
	return res.status(200).send('Invalid User Found');
}
	}
	else{
		return res.status(200).send('Invalid FileId sent');
	}

}

module.exports={postFiles,listAllFiles,downloadFile,deleteFile,listFilestoStaff_Studentid,listAllFilestoStaff};