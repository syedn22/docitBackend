const mongoose = require('mongoose');
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const Schema = mongoose.Schema;
const validator = require("mongoose-validator");

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
    },
    users:[{type:new Schema({
        UserId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        Name:{
            type:String,
            trim:true,
            required:true
        },
        isStaff:{
            type:Boolean,
            required:true
        },
        Email:{
        type: String,
        trim:true,
        required: true,
        validate: [
            validator({
              validator: "isEmail",
              message: "please enter valid email...",
            }),
          ],
        },
        RegisterNo:{
            type:Number,
            trim:true,
            required:true
        }
    }),
    default:null
}
]
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