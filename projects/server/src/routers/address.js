const express = require("express");

const route = express.Router();
const { AddressController } = require("../controllers");
const { authUser } = require("../controllers/authorize");

route.get("/", authUser, AddressController.getAddress);
route.get("/detail", authUser, AddressController.getAddressDetail);
route.post("/select", authUser, AddressController.changeSelectedAddress);

module.exports = route;
