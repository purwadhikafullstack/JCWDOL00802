const express = require("express");
const {
  authUser,
  authUserTrans,
  authAdmin,
} = require("../controllers/authorize");
const { transactionController } = require("../controllers");
const route = express.Router();
const { uploader } = require("../config/uploader");


route.post("/list", authUser, transactionController.getTransaction);
route.post("/add", authUser, transactionController.addTrans);
route.get(
  "/changestatus",
  authUserTrans,
  transactionController.changeStatusTrans
);
route.get("/warehouse", authUser, transactionController.getWarehouse);
route.get("/detail", transactionController.getTransDetail);

route.post(
  "/uploadproof",
  authUser,
  uploader("/transactions").single("transaction_proof"),
  transactionController.uploadProof
);
route.post("/acctrans", transactionController.accTransaction);
route.post("/reject", transactionController.rejectTransaction);
route.post("/proceed", transactionController.proceedTransaction);
route.post("/dikemas", transactionController.dikemasTransaction);
route.post("/cancel", transactionController.cancelTransaction);
route.post("/listall", authAdmin, transactionController.getOrdersAdmin);
route.get("/orderid", authAdmin, transactionController.getOrderById);
route.post("/sending", transactionController.sendingPackage);

module.exports = route;
