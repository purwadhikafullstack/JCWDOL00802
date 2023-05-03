const express = require("express");
const { rajaOngkirController } = require("../controllers");
const { authUser } = require("../controllers/authorize");
const route = express.Router();

route.get("/getprovince", rajaOngkirController.getProvince);
route.get("/getcity", rajaOngkirController.getCity);
route.post("/ship", authUser, rajaOngkirController.getShipment);
route.get("/getcityaddress", rajaOngkirController.getCityAddress);

module.exports = route;
