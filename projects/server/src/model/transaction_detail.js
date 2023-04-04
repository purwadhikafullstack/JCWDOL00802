const TransactionModel = require("./transaction");
const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const TransactionDetailModel = dbSequelize.define(
  "Transaction_Detail",
  {
    id_transaction_detail: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_transaction: {
      type: DataTypes.INTEGER,
    },
    id_product: {
      type: DataTypes.INTEGER,
    },
    total_item: {
      type: DataTypes.INTEGER,
    },
    purchased_price: {
      type: DataTypes.INTEGER,
    },
    total_purchased_price: {
      type: DataTypes.INTEGER,
    },
    notes: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: false }
);

module.exports = TransactionDetailModel;
