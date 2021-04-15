const express = require('express');
const Router = express.Router();
const {getUser,UpdateUser,deleteUser,deleteUsers,InsertUser} =require('../Controller/UserController');


Router.get('/',getUser)
 Router.post('/', InsertUser)
Router.put('/:id',UpdateUser)
Router.delete('/:id',deleteUser)
Router.delete('/',deleteUsers);


module.exports = Router;
