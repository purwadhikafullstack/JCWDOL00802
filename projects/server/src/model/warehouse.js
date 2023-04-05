const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");

const { DataTypes } = Sequelize;

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

module.exports = WarehouseModel;
