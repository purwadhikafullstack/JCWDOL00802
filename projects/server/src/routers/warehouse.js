const express = require("express");
const { warehouseController, authorizeController } = require("../controllers");
const { authAdmin } = require("../controllers/authorize");
const route = express.Router();

//AUTH SUPER ADMIN
route.get(
  "/list",
  authorizeController.authSuperAdmin,
  warehouseController.getDataWarehouse
);
route.post("/addwarehouse", warehouseController.addWarehouse);
route.post("/deletewarehouse", warehouseController.deleteWarehouse);

//AUTH MINIMAL ADMIN
route.get(
  "/detailwarehouse",
  //   authorizeController.authAdmin,
  warehouseController.getIdWarehouse
);
route.get("/postal", warehouseController.getPostalWarehouse);
route.post("/editwarehouse", warehouseController.editWarehouse);

module.exports = route;
