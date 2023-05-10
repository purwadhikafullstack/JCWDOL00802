const express = require("express");
const { readToken } = require("../config/encript");
const { userController, authorizeController } = require("../controllers");
const route = express.Router();
const multer = require('multer');
const path = require ('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/public/img/profile/");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        Date.now() +
          "." +
          file.originalname.split(".")[file.originalname.split(".").length - 1]
      );
    },
  });
  
  const fileFilter = (req, file, cb) => {
    // Accept only jpg, png, and jpeg files
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only jpg, png, and jpeg files are allowed."
        ),
        false
      );
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  });

route.get("/", userController.getDataUser);
route.post("/regis", userController.regis);
route.post("/verify", readToken, userController.verify);
route.post("/resetRequest", userController.requestReset);
route.patch("/resetpassword", readToken, userController.resetPassword);
route.post("/login", userController.login);
route.get("/keep", authorizeController.authUser, userController.keepLogin);

route.get("/profile", authorizeController.authUser, userController.getProfile); 
route.post("/edit", authorizeController.authUser, upload.single('profile_picture') ,userController.editProfile ); 

route.post(
  "/listuser",
  authorizeController.authSuperAdmin,
  userController.getUserList
);

route.delete(
  "/delete",
  authorizeController.authSuperAdmin,
  userController.deleteUser
);

route.post(
  "/edituser",
  authorizeController.authSuperAdmin,
  upload.single("profile_picture"),
  userController.updateUser
);

route.post(
  "/adduser",
  authorizeController.authSuperAdmin,
  upload.single("profile_picture"),
  userController.addUser
);

route.get("/user", userController.getUserByID)

module.exports = route;
