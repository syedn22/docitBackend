const express = require("express");
const Router = express.Router();
const {
  getUser,
  getUsers,
  UpdateUser,
  deleteUser,
  deleteUsers,
  InsertUser,
} = require("../Controller/UserController");

Router.get("/", getUsers);
Router.get("/:id", getUser);
Router.post("/", InsertUser);
//Router.post('/', InsertUsers)
Router.put("/:id", UpdateUser);
Router.delete("/:id", deleteUser);
Router.delete("/", deleteUsers);

module.exports = Router;
