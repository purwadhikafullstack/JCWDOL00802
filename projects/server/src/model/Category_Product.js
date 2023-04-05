const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");

const { DataTypes } = Sequelize;

const CategoryProductModel = dbSequelize.define(
  "Category_Product",
  {
    id_category_product: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_category: {
      type: DataTypes.INTEGER,
    },
    id_product: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: false }
);

module.exports = CategoryProductModel;
