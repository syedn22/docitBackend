const fs=require('fs');
const postFiles=(req,res,next)=>{
    res.send(req.file)    
}

const listAllFiles = (req, res) => {
	const uploadFolder='public/upload/'+req.params.RegisterNo;
	fs.readdir(uploadFolder, (err, files) => {
		res.send(files);
	})
}

const downloadFile = (req, res) => {
	var filename = req.params.filename;
	res.download(uploadFolder + filename);  
}

module.exports={postFiles,listAllFiles,downloadFile};