const express = require('express');
const Router = express.Router();
const {InsertClassroom,getClassroom,UpdateClassroom,deleteClassroom} =require('../Controller/ClassroomController');

  
Router.get('/',getClassroom)
Router.post('/', InsertClassroom)
Router.put('/:id', UpdateClassroom)
Router.delete('/:id',deleteClassroom)



module.exports = Router;
