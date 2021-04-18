const mongoose = require('mongoose');
const Joi = require("joi");
const Schema = mongoose.Schema;
Joi.objectId = require("joi-objectid")(Joi);


const FileSchema=new Schema({
    studentId:{
        type:Schema.Types.ObjectId,
        ref:'User',
       required:true
    },
    classroomId:{
        type:Schema.Types.ObjectId,
        ref:'Classroom',
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:['PD','OD','OTHERS']
    },
    filepath:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true
    },
    filename:{
        type:String,
        required:true
    }
})

const FileModel=mongoose.model("file",FileSchema);
module.exports.Files = FileModel;