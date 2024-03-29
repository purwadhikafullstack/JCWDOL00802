const express = require("express");
const { readToken } = require("../config/encript");
const { userController, authorizeController } = require("../controllers");
const route = express.Router();
const { uploader } = require("../config/uploader");

route.post("/regis", userController.regis);
route.post("/verify", readToken, userController.verify);
route.post("/resetRequest", userController.requestReset);
route.patch("/resetpassword", readToken, userController.resetPassword);
route.post("/login", userController.login);
route.get("/keep", authorizeController.authUser, userController.keepLogin);

route.get("/profile", authorizeController.authUser, userController.getProfile); 

route.post(
  "/edit",
  authorizeController.authUser,
  uploader("/profile").single("profile_picture"),
  userController.editProfile
);

route.post(
  "/listuser",
  authorizeController.authSuperAdmin,
  userController.getUserList
);

route.post(
  "/edituser",
  authorizeController.authSuperAdmin,
  userController.updateUser
);

route.get("/user", userController.getUserByID)

module.exports = route;
