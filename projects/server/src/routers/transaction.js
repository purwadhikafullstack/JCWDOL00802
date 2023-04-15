const express = require("express");
const { authUser } = require("../controllers/authorize");
const { TransactionController } = require("../controllers");
const route = express.Router();

route.get("/list", authUser, TransactionController.getTransaction);
route.post("/add", authUser, TransactionController.addTrans);
route.get("/changestatus", TransactionController.changeStatusTrans);
route.get("/warehouse", authUser, TransactionController.getWarehouse);
module.exports = route;
