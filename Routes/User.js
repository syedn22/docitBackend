const express = require("express");
const Router = express.Router();
const {authenticateToken}=require('../Authentication/authtoken');
const {
  getUser,
  getUsers,
  UpdateUser,
  deleteUser,
  deleteUsers,
  InsertUser,
} = require("../Controller/UserController");

Router.get("/", authenticateToken,getUsers);
Router.get("/:id", authenticateToken, getUser);
Router.post("/", authenticateToken, InsertUser);
Router.put("/:id", authenticateToken, UpdateUser);
Router.delete("/:id", authenticateToken, deleteUser);
Router.delete("/", authenticateToken, deleteUsers);

module.exports = Router;
