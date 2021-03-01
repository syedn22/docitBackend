const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Students = new schema({
  EmailId: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Classroom: [
    {
      text: String,
    },
  ],
});

const students = mongoose.model("Students", Students);

module.exports = students;
