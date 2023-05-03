const express = require("express");

const route = express.Router();
const { addressController } = require("../controllers");
const { authUser } = require("../controllers/authorize");

route.get("/", authUser, addressController.getAddress);
route.get("/detail", authUser, addressController.getAddressDetail);
route.post("/select", authUser, addressController.changeSelectedAddress);

route.get("/list", authUser, addressController.getAddress);
route.delete("/delete", authUser, addressController.deleteAddress); 
route.post("/add", authUser,addressController.addAddress);
route.put("/edit", authUser, addressController.updateAddress);
route.post("/setdefault", authUser, addressController.changeDefaultAddress);

module.exports = route;
