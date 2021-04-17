const mongoose = require('mongoose');
const Joi = require("joi");
const Schema = mongoose.Schema;
const validator = require("mongoose-validator");
const passwordComplexity = require("joi-password-complexity");
Joi.objectId = require("joi-objectid")(Joi);

const UserSchema = new Schema({
    Email: {
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
    Password: {
        type: String,
        trim:true,
        required: true
    },
    Name:{
        type:String,
        trim:true,
        required:true
    },
    Phone:{
        type:Number,
        trim:true,
        required:true,
    },
    RegisterNo:{
        type:Number,
        trim:true,
        required:true,
    },
    isStaff:{
        type:Boolean,
        default:false,
        required:true
    },
    Classroom:{
        type:[
            {
                type: Schema.Types.ObjectId,
                ref: "Classroom"
            }
        ],
    validate:{
        validator:function(v){
            return v && v.length >0;
        },
        message:'At least One Classroom should be present'
    }}
});


const complexityOptions = {
    min: 5,
    max: 15,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
};

const validateUser=(user)=> {
    const schema = Joi.object({
      Name: Joi.string().min(3).max(255).required(),
      Phone: Joi.number().required(),
      isStaff:Joi.boolean().required(),
      RegisterNo:Joi.number().required(),
      Password: passwordComplexity(complexityOptions),
      ClassroomId:Joi.array().items(Joi.objectId()).min(1)
    });
    return schema.validate(user);
  }

const User = mongoose.model("user",UserSchema);
module.exports.validate=validateUser;
module.exports.UserSchema=UserSchema;
module.exports.User = User;