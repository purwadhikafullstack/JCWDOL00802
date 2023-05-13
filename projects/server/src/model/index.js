const ProductModel = require("./Product");
const WarehouseAdminModel = require("./Warehouse_admin");
const PostalCodeModel = require("./postal_code");
const StockModel = require("./stock");
const UserModel = require("./user");
const UserRoleModel = require("./user_role");
const UserStatusModel = require("./user_status");
const WarehouseModel = require("./warehouse");
const WarehouseMutationModel = require("./warehouse_mutation");
const AddressModel = require("./address");
const StockHistoryModel = require("./stock_history");

module.exports = {
  UserModel,
  UserRoleModel,
  UserStatusModel,
  WarehouseModel,
  PostalCodeModel,
  StockModel,
  ProductModel,
  WarehouseAdminModel,
  AddressModel,
  WarehouseMutationModel,
  StockHistoryModel,
};
