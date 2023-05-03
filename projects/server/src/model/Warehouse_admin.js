const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const WarehouseAdminModel = dbSequelize.define(
  "Warehouse_admin",
  {
    id_warehouse_admin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
    },
    id_warehouse: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: false }
);

module.exports = WarehouseAdminModel;
