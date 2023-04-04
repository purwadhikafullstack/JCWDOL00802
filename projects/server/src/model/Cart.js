const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const ProductModel = require("./Product");
const { DataTypes } = Sequelize;

const CartModel = dbSequelize.define(
  "cart",
  {
    id_cart: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
    },
    id_product: {
      type: DataTypes.INTEGER,
    },
    total_item: {
      type: DataTypes.INTEGER,
    },
    selected: {
      type: DataTypes.TINYINT,
    },
  },
  { timestamps: false }
);

// CartModel.belongsTo(ProductModel, { foreignKey: "id_product" });
// ProductModel.hasMany(CartModel,{foreignKey : "id_product"});
// UsersModel.hasMany(CartModel,{foreignKey : "id_user"})
// CartModel.belongsTo(UsersModel);

module.exports = CartModel;
