const userController = require("./user");
const authorizeController = require("./authorize");
const ProductController = require("./product");
const warehouseController = require("./warehouse");
const rajaOngkirController = require("./rajaongkir");
const TransactionController = require("./transaction");

module.exports = {
  userController,
  authorizeController,
  ProductController,
  warehouseController,
  rajaOngkirController,
  TransactionController,
};
