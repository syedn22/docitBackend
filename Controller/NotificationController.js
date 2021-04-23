const {Notification,validate}=require('../Models/NotificationModel');
const {File}=require('../Models/fileModel');
const ObjectID=require('mongodb').ObjectID;

const SetDeleteNotification =
  ("/",
  async(req, res) => {
    const body=req.body;
    const {file,reason}=body;
    const { error } = validate({reason});
    if (error) return res.status(400).send(error.details[0].message);


    const Notify=new Notification({
        file:file,
        reason:reason,
        acceptedBy:null
    });

    try{
        const result=await Notify.save();
        return res.status(200).send("Request is Send to Staff")
    }
    catch(e)
    {
        console.log(e.message)
        return res.status(400).send("Notification Fails");
    }
  });


  const acceptDeleteNotification=async (req,res)=>{
      if(req.user.isStaff)
      {
          if(ObjectID.isValid(req.params.id) && await Notification.findById(req.params.id) && req.body.acceptedBy===null)
          {
              const n=req.body;
              n.acceptedBy=req.user._id;
              console.log(n);
              try{
                const notificationfiles=await Notification.findByIdAndUpdate(req.params.id,n,{ new: true });
                return res.status(200).send(notificationfiles);
              }
              catch(e)
              {
                console.log(e.message)
                return res.status(400).send("Cannot get Notification"); 
              }
          }
          else{
            return res.status(400).send("Invalid Classroom or Notification"); 
          }
      }
      else{
        return res.status(400).send("Invalid User"); 
      }
  }


const getNotification=('/:classroomid',async(req,res)=>{
    if(req.user.isStaff)
    {
        
	if(ObjectID.isValid(req.params.classroomid))
    {
        try{
            const notificationfiles=await Notification.find({'file.classroomId':req.params.classroomid});
            //const notificationfiles=await Notification.findById("6082c4c67722e956d0af3b3f");
            return res.status(200).send(notificationfiles);
        }
        catch(e)
        {
            console.log(e.message)
            return res.status(400).send("Cannot get Notification"); 
        }
    }
    else{
        return res.status(400).send("Invalid Classroom"); 
    }
    }
    else{
        return res.status(400).send("Invalid User"); 
    }
})

module.exports={getNotification,SetDeleteNotification,acceptDeleteNotification}