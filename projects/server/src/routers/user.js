const express = require("express");
const { readToken } = require("../config/encript");
const { userController, authorizeController } = require("../controllers");
const route = express.Router();

route.get("/", userController.getDataUser);
route.post("/regis", userController.regis);
route.post("/verify", readToken, userController.verify);
route.post("/resetRequest", userController.requestReset);
route.patch("/resetpassword", readToken, userController.resetPassword);
route.post("/login", userController.login);
route.get("/keep", authorizeController.authUser, userController.keepLogin);

module.exports = route;
