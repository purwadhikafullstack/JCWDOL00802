const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const StockHistoryTypeModel = dbSequelize.define(
  "Stock_history_type",
  {
    type: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

module.exports = StockHistoryTypeModel;
