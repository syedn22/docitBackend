const express = require('express');
const Router = express.Router();
const {InsertClassroom,getClassrooms,getClassroom, UpdateClassroom,deleteClassroom} =require('../Controller/ClassroomController');

const {authenticateToken}=require('../Authentication/authtoken');

Router.get('/',authenticateToken,getClassrooms)
Router.get('/:id',authenticateToken,getClassroom)
Router.post('/',authenticateToken, InsertClassroom)
Router.put('/:id',authenticateToken, UpdateClassroom)
Router.delete('/:id',authenticateToken,deleteClassroom)



module.exports = Router;
