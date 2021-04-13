const mongoose = require('mongoose');
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const Schema = mongoose.Schema;

const ClassroomSchema = new Schema({
    Name:{
        type:String,
        trim:true,
        required:true
    },
    Batch:{
        type:String,
        required:true
    },
    Period:{
        type:Number,
        required:true
    }
});

const validateClassroom=(classroom)=> {
    const schema = Joi.object({
      Name: Joi.string().min(3).max(255).required(),
      Batch:Joi.string().required(),
      Period:Joi.number().positive().required()
    });
    return schema.validate(classroom);
  }

const Classroom = mongoose.model("classroom",ClassroomSchema);
module.exports.Classroom = Classroom;
module.exports.validate = validateClassroom;