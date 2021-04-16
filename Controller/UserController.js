const { User, validate } = require("../Models/UserModel");
const { Classroom } = require("../Models/ClassroomModel");
const bcrypt = require("bcryptjs");
const Fawn = require("fawn");
const mongoose = require("mongoose");

Fawn.init(mongoose);

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
    const { Name, Phone, RegisterNo, Password, isStaff } = req.body;
    const { error } = validate({ Name, Phone, RegisterNo, Password, isStaff });
    if (error) return res.status(400).send(error.details[0].message);

    const classroom = [];
    for(let c of req.body.Classroom){
      console.log(c);
      const result =await Classroom.findById(c);
      if (!result) return res.status(400).send("Invalid classroom.");
      classroom.push(result);
      console.log(result);
    }

    var hash = bcrypt.hashSync(req.body.Password, 8);
    let user = new User({
      Email: req.body.Email,
      Password: hash,
      Phone: req.body.Phone,
      RegisterNo: req.body.RegisterNo,
      isStaff: req.body.isStaff,
      Name: req.body.Name,
      Classroom: req.body.Classroom,
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
                console.log(users);
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
    const { Name, Phone, RegisterNo, Password, isStaff } = req.body;
    const { error } = validate({ Name, Phone, RegisterNo, Password, isStaff });
    if (error) return res.status(400).send(error.details[0].message);
    var hash = bcrypt.hashSync(req.body.Password, 8);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        Email: req.body.Email,
        Password: hash,
        Phone: req.body.Phone,
        RegisterNo: req.body.RegisterNo,
        isStaff: req.body.isStaff,
        Name: req.body.Name,
        Classroom: req.body.Classroom,
      },
      { new: true }
    );

    if (!user) return res.status(404).send("User Not found");

    res.status(200).send(user);
  });

const deleteUser =
  ("/:id",
  async (req, res) => {
    const deletedUser = await User.findByIdAndRemove(req.params.id);

    if (!deletedUser) return res.status(404).send("User Not found");

    res.status(200).send(deletedUser);
  });

const deleteUsers =
  ("/",
  async (req, res) => {
    const deletedUser = await User.deleteMany({ _id: req.body._id });

    if (!deletedUser) return res.status(404).send("User Not found");

    res.status(200).send(deletedUser);
  });

module.exports = {
  InsertUser,
  getUser,
  getUsers,
  UpdateUser,
  deleteUser,
  deleteUsers,
};
