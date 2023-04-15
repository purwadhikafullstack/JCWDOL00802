const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;
const CartModel = require("./Cart");
const StockModel = require("./stock");
const WarehouseModel = require("./warehouse");
const CategoryProductModel = require("./Category_Product");
const StockHistoryModel = require("./Stock_History");

const ProductModel = dbSequelize.define(
  "Product",
  {
    id_product: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.INTEGER,
    },
    product_picture: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

StockModel.hasOne(ProductModel, { foreignKey: "id_product" });
ProductModel.hasMany(StockModel, {
  foreignKey: "id_product",
  sourceKey: "id_product",
  as: "stocks",
});
CartModel.belongsTo(ProductModel, { foreignKey: "id_product" });
ProductModel.hasMany(CartModel, { foreignKey: "id_product" });
StockModel.hasOne(WarehouseModel, {
  foreignKey: "id_warehouse",
  sourceKey: "id_warehouse",
});
WarehouseModel.hasMany(StockModel, {
  foreignKey: "id_warehouse",
  sourceKey: "id_warehouse",
});
WarehouseModel.belongsToMany(ProductModel, {
  through: StockModel,
  foreignKey: "id_product",
});

ProductModel.belongsToMany(WarehouseModel, {
  through: StockModel,
  foreignKey: "id_warehouse",
});
CategoryProductModel.hasMany(ProductModel, {
  foreignKey: "id_product",
});
ProductModel.hasMany(CategoryProductModel, {
  foreignKey: "id_product",
});
ProductModel.hasMany(StockHistoryModel, {
  foreignKey: "id_product",
  as: "stockprod",
});
module.exports = ProductModel;
