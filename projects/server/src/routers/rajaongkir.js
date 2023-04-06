const express = require("express");
const { rajaOngkirController } = require("../controllers");
const route = express.Router();

route.get("/getprovince", rajaOngkirController.getProvince);
route.get("/getcity", rajaOngkirController.getCity);

module.exports = route;
