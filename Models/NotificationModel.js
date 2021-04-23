const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {FileSchema}=require('./fileModel');
const Joi=require('joi');
Joi.objectId = require("joi-objectid")(Joi);

const NotificationSchema = new Schema({
    file: {
        type:FileSchema,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    acceptedBy:{
        type:Schema.Types.ObjectId,
        default:null,
    }
});

const validateNotification=(classroom)=> {
    const schema = Joi.object({
      reason: Joi.string().min(3).max(255).required()
    });
    return schema.validate(classroom);
  }


const Notification = mongoose.model("notification",NotificationSchema);
module.exports.Notification = Notification;
module.exports.validate=validateNotification;