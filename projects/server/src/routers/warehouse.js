const express = require("express");
const { warehouseController, authorizeController } = require("../controllers");
const route = express.Router();

//AUTH SUPER ADMIN
route.post(
  "/list",
  authorizeController.authSuperAdmin,
  warehouseController.getDataWarehouse
);
route.post(
  "/addwarehouse",
  authorizeController.authSuperAdmin,
  warehouseController.addWarehouse
);
route.post(
  "/deletewarehouse",
  authorizeController.authSuperAdmin,
  warehouseController.deleteWarehouse
);

//AUTH MINIMAL ADMIN
route.get(
  "/detailwarehouse",
  authorizeController.authSuperAdmin,
  warehouseController.getIdWarehouse
);
route.get("/postal", warehouseController.getPostalWarehouse);
route.post(
  "/editwarehouse",
  authorizeController.authSuperAdmin,
  warehouseController.editWarehouse
);
module.exports = route;
