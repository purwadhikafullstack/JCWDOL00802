const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const  ProductModel  = require("./Product");
const { WarehouseModel, associateWarehouseModel } = require("./warehouse");
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

const associateWarehouseMutationModel = (ProductModel, WarehouseModel) => {
  WarehouseMutationModel.belongsTo(ProductModel, {
    foreignKey: 'id_product',
    as: 'product',
  });
  WarehouseMutationModel.belongsTo(WarehouseModel, {
    foreignKey: 'id_warehouse_receiver',
    as: 'warehouseReceiver',
  });
};

module.exports = { WarehouseMutationModel, associateWarehouseMutationModel };
