const express = require("express");
const { rajaOngkirController } = require("../controllers");
const route = express.Router();

route.get("/getprovince", rajaOngkirController.getProvince);
route.get("/getcity", rajaOngkirController.getCity);
route.post("/ship", rajaOngkirController.getShipment);

module.exports = route;
