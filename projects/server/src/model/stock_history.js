const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");

const { DataTypes } = Sequelize;

const StockHistoryModel = dbSequelize.define(
  "stock_history",
  {
    id_stock_history: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_warehouse: {
      type: DataTypes.INTEGER,
    },
    id_product: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE(0),
    },
    type: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    note: {
      type: DataTypes.STRING,
    },
    total: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: false }
);

module.exports = StockHistoryModel;
