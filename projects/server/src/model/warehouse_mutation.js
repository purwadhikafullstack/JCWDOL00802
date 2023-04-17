const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");

const { DataTypes } = Sequelize;

const WarehouseMutationModel = dbSequelize.define(
  "Warehouse_Mutation",
  {
    id_mutation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_product: {
      type: DataTypes.INTEGER,
    },
    id_warehouse_sender: {
      type: DataTypes.INTEGER,
    },
    id_warehouse_receiver: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE(0),
    },
    total_item: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    reference: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

module.exports = WarehouseMutationModel;
