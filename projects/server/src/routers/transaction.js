const express = require("express");
const { authUser } = require("../controllers/authorize");
const { TransactionController } = require("../controllers");
const route = express.Router();

route.get("/list", authUser, TransactionController.getTransaction);
module.exports = route;
