const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const ProductModel = require("./Product");
const UserModel = require("./user");
const { DataTypes } = Sequelize;

const WishlistModel = dbSequelize.define(
  "wishlist",
  {
    id_wishlist: {
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
  },
  { timestamps: false }
);

UserModel.hasMany(WishlistModel, { foreignKey: "id_user" });
WishlistModel.belongsTo(UserModel, { foreignKey: "id_user" });
WishlistModel.belongsTo(ProductModel, {
  foreignKey: "id_product",
});
ProductModel.hasMany(WishlistModel, { foreignKey: "id_product" });

module.exports = WishlistModel;
