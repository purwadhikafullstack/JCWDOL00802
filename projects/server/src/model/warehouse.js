const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const WarehouseAdminModel = require("./Warehouse_admin");
const { DataTypes } = Sequelize;
const StockModel = require("./stock");

const WarehouseModel = dbSequelize.define(
  "warehouse",
  {
    id_warehouse: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    warehouse_branch_name: {
      type: DataTypes.STRING,
    },
    coordinate_lat: {
      type: DataTypes.INTEGER,
    },
    coordinate_long: {
      type: DataTypes.INTEGER,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    postal_code: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    detail_address: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

StockModel.hasOne(WarehouseModel, { foreignKey: "id_warehouse" });
WarehouseModel.hasMany(StockModel, {
  foreignKey: "id_warehouse",
  sourceKey: "id_warehouse",
});

module.exports = WarehouseModel;
