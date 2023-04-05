const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const ProductModel = require("./Product");
const TransactionDetailModel = require("./transaction_detail");
const TransactionStatusModel = require("./transaction_status");
const { DataTypes } = Sequelize;

const TransactionModel = dbSequelize.define(
  "Transaction",
  {
    id_transaction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE(0),
    },
    date_send: {
      type: DataTypes.DATE(0),
    },
    warehouse_sender: {
      type: DataTypes.INTEGER,
    },
    shipment_fee: {
      type: DataTypes.INTEGER,
    },
    total_price: {
      type: DataTypes.INTEGER,
    },
    transaction_status: {
      type: DataTypes.INTEGER,
    },
    transaction_proof: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    shipment_service: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.INTEGER,
    },
    resi: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

TransactionStatusModel.belongsTo(TransactionModel, {
  foreignKey: "status",
  targetKey: "transaction_status",
});
TransactionModel.hasOne(TransactionStatusModel, {
  foreignKey: "status",
  sourceKey: "transaction_status",
});
TransactionModel.hasMany(TransactionDetailModel, {
  foreignKey: "id_transaction",
});
TransactionDetailModel.belongsTo(TransactionModel, {
  foreignKey: "id_transaction",
});
TransactionDetailModel.hasOne(ProductModel, {
  foreignKey: "id_product",
  sourceKey: "id_product",
});
ProductModel.hasMany(TransactionDetailModel, {
  foreignKey: "id_product",
  targetKey: "id_product",
  as: "prodtrans",
});

ProductModel.belongsToMany(TransactionModel, {
  through: TransactionDetailModel,
  foreignKey: "id_product",
  sourceKey: "id_product",
});
TransactionModel.belongsToMany(ProductModel, {
  through: TransactionDetailModel,
  foreignKey: "id_transaction",
  sourceKey: "id_transaction",
});
module.exports = TransactionModel;
