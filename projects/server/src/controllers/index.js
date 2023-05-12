const userController = require("./user");
const authorizeController = require("./authorize");
const ProductController = require("./product");
const warehouseController = require("./warehouse");
const rajaOngkirController = require("./rajaongkir");
const transactionController = require("./transaction");
const cartController = require("./cart");
const addressController = require("./address");
const dashboardController = require("./dashboard");
const PromosController = require("./promos");
const warehouseAdminController = require("./warehouseAdmin");
const wishlistController = require("./wishlist");

module.exports = {
  userController,
  authorizeController,
  ProductController,
  warehouseController,
  rajaOngkirController,
  transactionController,
  cartController,
  addressController,
  dashboardController,
  PromosController,
  warehouseAdminController,
  wishlistController,
};
