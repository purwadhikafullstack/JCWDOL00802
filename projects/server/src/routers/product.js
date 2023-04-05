const express = require("express");
const route = express.Router();
const { readAdmin } = require("../config/encript");
const { ProductController, authorizeController } = require("../controllers");

route.get(
  "/sales",
  authorizeController.authUser,
  ProductController.getProductSales
);
route.get("/category", ProductController.getCategory);
route.get(
  "/warehouse",
  authorizeController.authUser,
  ProductController.getWarehouse
);
module.exports = route;
