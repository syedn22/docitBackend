const express = require("express");
const Router = express.Router();
const {authenticateToken}=require('../Authentication/authtoken');
const {
SetDeleteNotification,
getNotification,
acceptDeleteNotification
} = require("../Controller/NotificationController");

Router.get("/:classroomid", authenticateToken,getNotification);
Router.post("/", authenticateToken, SetDeleteNotification);
Router.put("/:id",authenticateToken,acceptDeleteNotification)

module.exports = Router;