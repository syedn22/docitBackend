
const {Classroom,validate} = require('../Models/ClassroomModel');
const {User}=require('../Models/UserModel');

const getClassroom=('/',(req,res)=>{
    Classroom.find().exec((err,course)=>{
if(err)
{
    return res.status(500).send(err.message);
}
res.status(200).send(course)
})              
})

const InsertClassroom=('/', async (req, res) => {
    const {Name,Batch,Period}=req.body;
    const { error } = validate({Name,Batch,Period});
    if (error) return res.status(400).send(error.details[0].message);

    
    let classroom = new Classroom({
        Name:req.body.Name,
        Batch:req.body.Batch,
        Period:req.body.Period
    });

    try{
    Classroom.find({Name:req.body.Name}).exec((err,d)=>{
        if(d.length >0)
        {
            console.log(d)
            return res.status(400).send("Already Classroom Exist");
        }
        else{
            classroom.save(err=>{
                if(err)
                {
                console.log(err);
                res.send(err);
                }
                });
            console.log("classroom added successfully");
            res.status(200).send(classroom);
        }
    })
}
catch(e){
    res.send(e.message);
}
    
})


const UpdateClassroom=('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      {
        Name:req.body.Name,
        Batch:req.body.Batch,
        Period:req.body.Period
      },
      { new: true }
    );
  
    if (!classroom)    return res.status(404).send("Classroom Not found");
  
    res.status(200).send(classroom);
})


const deleteClassroom=('/:id',async (req, res) => {

    const DeleteUser=await User.findOneAndRemove({Classroom:req.params.id});
    const classroom = await Classroom.findByIdAndRemove(req.params.id);

    if(!classroom)
      return res
        .status(404)
        .send("Department Not found");
  
    res.status(200).send({classroom,DeleteUser});
})



module.exports ={InsertClassroom,getClassroom,UpdateClassroom,deleteClassroom}



