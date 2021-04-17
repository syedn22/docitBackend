const { User, validate } = require("../Models/UserModel");
const { Classroom } = require("../Models/ClassroomModel");
const bcrypt = require("bcryptjs");
const Fawn = require("fawn");
const mongoose = require("mongoose");

const getUsers =
  ("/",
  (req, res) => {
    User.find().exec((err, users) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(200).send(users);
    });
  });

  
const getUser =
  ("/:id",
  (req, res) => {
    User.findById(req.params.id).exec((err, user) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(200).send(user);
    });
  });

const InsertUser =
  ("/",
  async (req, res) => {
    const { Name, Phone, RegisterNo, Password, isStaff,ClassroomId } = req.body;
    const { error } = validate({ Name, Phone, RegisterNo, Password, isStaff,ClassroomId });
    if (error) return res.status(400).send(error.details[0].message);

    const classroom = [];
    for(let c of req.body.Classroom){
      const result =await Classroom.findById(c);
      if (!result) return res.status(400).send("Invalid classroom.");
      classroom.push(result);
    }

    var hash = bcrypt.hashSync(req.body.Password, 8);
    let user = new User({
      Email: req.body.Email,
      Password: hash,
      Phone: req.body.Phone,
      RegisterNo: req.body.RegisterNo,
      isStaff: req.body.isStaff,
      Name: req.body.Name,
      Classroom: req.body.ClassroomId,
    });

    try {
      User.find(
        {
          $and: [
            { Email: req.body.Email },
            { RegisterNo: req.body.RegisterNo },
          ],
        },
        (err, d) => {
          if (d.length > 0) {
            console.log(d);
            return res.status(400).send("Already User Exists");
          } else {
            try {
              let task = Fawn.Task();
              task = task.save("users", user);
              for (let c of classroom) {
                const users = c.users;
                users.push(user);
                task = task.update(
                  'classrooms', {
                    _id: c._id
                  }, {
                    $set: {
                      users: users
                    }
                  }
                )
              }
              task.run();
              res.send(user);
            } catch (ex) {
              res.status(500).send("Something failed." + ex.message);
            }
          }
        }
      );
    } catch (e) {
      res.send(e.message);
    }
  });

// const InsertUsers=('/', async (req, res) => {
//     const { error } = validateUsers(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     try{

//     User.find(req.body,(err,d)=>{
//         if(d.length > 0)
//         {
//             console.log(d);
//             return res.status(400).send("Already User Exists",d);
//         }
//         else{
//             User.insertMany(req.body).then((users)=>{
//                 console.log("Users are Added Successfully");
//                 res.status(200).send(users);
//             })
//             .catch(e=>{
//                 res.status(400).send(e.message);
//             })

//         }
//     })
// }
// catch(e){
//     res.send(e.message);
// }

// })

const UpdateUser =
  ("/:id",
  async (req, res) => {
    const { Name, Phone, RegisterNo, Password, isStaff,ClassroomId } = req.body;
    const { error } = validate({ Name, Phone, RegisterNo, Password, isStaff,ClassroomId });
    if (error) return res.status(400).send(error.details[0].message);
    var hash = bcrypt.hashSync(req.body.Password, 8);

    const updatedUser = {
      Email: req.body.Email,
      Password: hash,
      Phone: req.body.Phone,
      RegisterNo: req.body.RegisterNo,
      isStaff: req.body.isStaff,
      Name: req.body.Name,
      Classroom: req.body.Classroom,
    };

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User Not found");

    const classUser = await User.findById(req.params.id).select({ Name: 1, RegisterNo: 1, isStaff: 1, Email: 1 });
    classUser.Name = req.body.Name;
    classUser.RegisterNo = req.body.RegisterNo;
    classUser.isStaff = req.body.isStaff;
    classUser.Email = req.body.Email;

    const deleteClassroom = [];
    for(let classroom of user.Classroom){
      const result =await Classroom.findById(classroom);
      if (result) 
        deleteClassroom.push(result);
    };

    const updateClassroom = [];
    for(let classroom of req.body.Classroom){
      const result =await Classroom.findById(classroom);
      if (!result) return res.status(400).send("Invalid classroom.");
      updateClassroom.push(result);
    }

    try {
      let task = Fawn.Task();
      task = task.update("users", {_id : user._id} , updatedUser);
      for (let c of deleteClassroom) {
        const users = c.users;
        let index;
        for(let i in c.users){
          if(c.users[i]._id.toString() === user._id.toString()){
            index = i;
            break;
          }
        }
        users.splice(index,1);
        task = task.update('classrooms', {_id: c._id},
        {
            $set: {users: users}
        }
        )
      }
      for(let c of updateClassroom){
        const users = c.users;
        let index = -1;
        for(let i in c.users){
          if(c.users[i]._id.toString() === user._id.toString()){
            index = i;
            break;
          }
        }
        if(index != -1){
          users[index].Name = req.body.Name;
          users[index].RegisterNo = req.body.RegisterNo;
          users[index].isStaff = req.body.isStaff;
          users[index].Email = req.body.Email;
        }
        else{
          users.push(classUser);
        }
        task = task.update('classrooms', {_id: c._id},
        {
            $set: {users: users}
        }
        )
      }
      task.run();
      res.send("Updated");
    } catch (ex) {
      res.status(500).send("Something failed." + ex.message);
    }
  });

const deleteUser =
  ("/:id",
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User Not found");

    const classroom = [];
    for(let c of user.Classroom){
      const result =await Classroom.findById(c);
      if (!result) return res.status(400).send("Invalid classroom.");
      classroom.push(result);
    }

    try {
      let task = Fawn.Task();
      task = task.remove("users", {_id : user._id});
      for (let c of classroom) {
        const users = c.users;
        let index;
        for(let i in c.users){
          if(c.users[i]._id.toString() === user._id.toString()){
            index = i;
            break;
          }
        }
        users.splice(index,1);
        task = task.update('classrooms', {_id: c._id},
        {
            $set: {users: users}
        }
        )
      }
      task.run();
    } catch (ex) {
      res.status(500).send("Something failed." + ex.message);
    }
    
    res.status(200).send(user);
  });

const deleteUsers =
  ("/",
  async (req, res) => {
    // const deletedUser = await User.deleteMany({ _id: req.body._id });
    // if (!deletedUser) return res.status(404).send("User Not found");
    // res.status(200).send(deletedUser);
  });

module.exports = {
  InsertUser,
  getUser,
  getUsers,
  UpdateUser,
  deleteUser,
  deleteUsers,
};
