const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const WarehouseMutationStatusModel = dbSequelize.define(
  "warehouse_mutation_statuses",
  {
    warehouse_mutation_statuses: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = WarehouseMutationStatusModel;
