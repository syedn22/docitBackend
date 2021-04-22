const mongoose = require('mongoose');
const Joi = require("joi");
const Schema = mongoose.Schema;
const passwordComplexity = require("joi-password-complexity");

const AdminSchema = new Schema({
    Password: {
        type: String,
        trim:true,
        required: true
    },
    Username:{
        type:String,
        trim:true,
        required:true
    }
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
      Username: Joi.string().min(3).max(255).required(),
      Password: passwordComplexity(complexityOptions)
    });
    return schema.validate(user);
  }

const Admin = mongoose.model("admin",AdminSchema);
module.exports.validate=validateUser;
module.exports.Admin = Admin;