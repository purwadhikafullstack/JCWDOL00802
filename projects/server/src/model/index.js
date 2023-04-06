const ProductModel = require("./Product");
const WarehouseAdminModel = require("./Warehouse_admin");
const PostalCodeModel = require("./postal_code");
const StockModel = require("./stock");
const UserModel = require("./user");
const UserRoleModel = require("./user_role");
const UserStatusModel = require("./user_status");
const WarehouseModel = require("./warehouse");

module.exports = {
  UserModel,
  UserRoleModel,
  UserStatusModel,
  WarehouseModel,
  PostalCodeModel,
  StockModel,
  ProductModel,
  WarehouseAdminModel,
};
