const express = require("express");

const route = express.Router();
const { addressController } = require("../controllers");
const { authUser } = require("../controllers/authorize");

route.get("/", authUser, addressController.getAddress);
route.get("/detail", authUser, addressController.getAddressDetail);
route.post("/select", authUser, addressController.changeSelectedAddress);

module.exports = route;
