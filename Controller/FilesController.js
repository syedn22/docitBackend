const fs=require('fs');
const {Files}=require('../Models/fileModel');
const {User}=require('../Models/UserModel');
const {Classroom}=require('../Models/ClassroomModel');
const path=require('path');


const postFiles=async(req,res,next)=>{

	try{
	if(req.files)
	{
	 
		const {RegisterNo,category,date}=JSON.stringify(req.body);
		const reg=parseInt(RegisterNo)

		const Class=await Classroom.findById(req.user.Classroom[0]) 
		if(!Class) return res.status(400).send("No Class Found");

		let f=[];
       for(let fileobj of req.files)
	   {
		const file=new Files({
			studentId:req.user._id,
			classroomId:Class._id,
			category:req.body.category,
			filepath:fileobj.destination+"/"+fileobj.filename,
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
	else{
	  return res.send('Please Upload a File');
	}
}
catch(e)
{
	console.log(e.message)
}
}

const listAllFiles =async (req, res) => {

	if(req.user)
	{
		let Class="";
	Class=await Classroom.findById(req.user.Classroom[0]) 
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

const downloadFile = async (req, res) => {
	if(req.user)
	{
	let Class="";
	Class=await Classroom.findById(req.user.Classroom[0]) 
	const uploadFolder='public/upload/'+Class.Name+'/'+req.user.RegisterNo;
	var filename = req.params.filename;
	res.download(uploadFolder + '/'+filename);
	}
	else{
		return res.status(200).send('Invalid User Found');
	}  
}

const deleteFile=async(req,res)=>{

	const deletefileid=req.params.id;

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

module.exports={postFiles,listAllFiles,downloadFile,deleteFile};