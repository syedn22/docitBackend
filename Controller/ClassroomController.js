const { Classroom, validate } = require("../Models/ClassroomModel");
const { User } = require("../Models/UserModel");
const fs=require('fs');

const getClassrooms =
  ("/",
  (req, res) => {
    Classroom.find().exec((err, courses) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(200).send(courses);
    });
  });

const getClassroom =
  ("/:id",
  (req, res) => {
    // const classroom = await Classroom.findByIdAndRemove(req.params.id);
    Classroom.findById(req.params.id).exec((err, classroom) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(200).send(classroom);
    });
  });

const InsertClassroom =
  ("/",
  async (req, res) => {
    const { Name, Batch, Period } = req.body;
    const { error } = validate({ Name, Batch, Period });
    if (error) return res.status(400).send(error.details[0].message);

    let classroom = new Classroom({
      Name: req.body.Name,
      Batch: req.body.Batch,
      Period: req.body.Period,
    });

    try {
      Classroom.find({ Name: req.body.Name }).exec((err, d) => {
        if (d.length > 0) {
          console.log(d);
          return res.status(400).send("Already Classroom Exist");
        } else {
          classroom.save((err) => {
            if (err) {
              console.log(err);
              res.send(err);
            }
          });

          path="public/upload/"+Name;
          fs.access(path, (error) => {
            if (error) {
              fs.mkdir(path, (error) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log("New Directory created successfully !!");
                }
              });
            } else {
              console.log("Given Directory already exists !!");
            }
          });

          console.log("classroom added successfully");
          res.status(200).send(classroom);
        }
      });
    } catch (e) {
      res.send(e.message);
    }
  });

const UpdateClassroom =
  ("/:id",
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      {
        Name: req.body.Name,
        Batch: req.body.Batch,
        Period: req.body.Period,
      },
      { new: true }
    );

    if (!classroom) return res.status(404).send("Classroom Not found");

    res.status(200).send(classroom);
  });

const deleteClassroom =
  ("/:id",
  async (req, res) => {
    const DeleteUser = await User.findOneAndRemove({
      Classroom: req.params.id,
    });
    const classroom = await Classroom.findByIdAndRemove(req.params.id);

    if (!classroom) return res.status(404).send("Department Not found");

    res.status(200).send({ classroom, DeleteUser });
  });

module.exports = {
  InsertClassroom,
  getClassrooms,
  getClassroom,
  UpdateClassroom,
  deleteClassroom,
};
