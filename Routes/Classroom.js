const express = require('express');
const Router = express.Router();
const {InsertClassroom,getClassrooms,getClassroom, UpdateClassroom,deleteClassroom} =require('../Controller/ClassroomController');


Router.get('/',getClassrooms)
Router.get('/:id',getClassroom)
Router.post('/', InsertClassroom)
Router.put('/:id', UpdateClassroom)
Router.delete('/:id',deleteClassroom)



module.exports = Router;
