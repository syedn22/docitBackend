const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    PD:{
        type:String,
        minlength:3,
        maxlength:15,
        trim:true
    },
    OD:{
        type:String,
        minlength:3,
        maxlength:15,
        trim:true
    }
});


const Category = mongoose.model("category",CategorySchema);
module.exports.Category = Category;