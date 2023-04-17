const express = require("express");
const { authUser } = require("../controllers/authorize");
const { transactionController } = require("../controllers");
const route = express.Router();

route.get("/list", authUser, transactionController.getTransaction);
route.post("/add", authUser, transactionController.addTrans);
route.get("/changestatus", transactionController.changeStatusTrans);
route.get("/warehouse", authUser, transactionController.getWarehouse);
module.exports = route;
