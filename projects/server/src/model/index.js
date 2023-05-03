const ProductModel = require("./Product");
const { WarehouseAdminModel, associateWarehouseAdminModel } = require("./Warehouse_admin");
const PostalCodeModel = require("./postal_code");
const StockModel = require("./stock");
const UserModel = require("./user");
const UserRoleModel = require("./user_role");
const UserStatusModel = require("./user_status");
const { WarehouseModel, associateWarehouseModel } = require("./warehouse");
const { WarehouseMutationModel, associateWarehouseMutationModel } = require("./warehouse_mutation");
const AddressModel = require("./address");

// Call the association functions
associateWarehouseModel(WarehouseAdminModel);
associateWarehouseMutationModel(ProductModel, WarehouseModel);


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
  WarehouseMutationModel
};
