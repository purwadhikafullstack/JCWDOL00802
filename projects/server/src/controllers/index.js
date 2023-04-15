const userController = require("./user");
const authorizeController = require("./authorize");
const ProductController = require("./product");
const warehouseController = require("./warehouse");
const rajaOngkirController = require("./rajaongkir");
const TransactionController = require("./transaction");
const CartController = require("./cart");
const AddressController = require("./address");

module.exports = {
  userController,
  authorizeController,
  ProductController,
  warehouseController,
  rajaOngkirController,
  TransactionController,
  CartController,
  AddressController,
};
