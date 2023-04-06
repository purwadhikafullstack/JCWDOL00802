const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

// const AddressModel = require("./address");
const WarehouseModel = require("./warehouse");

const PostalCodeModel = dbSequelize.define(
  "postal_code",
  {
    postal_code: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
      type: DataTypes.STRING,
    },
    province: {
      type: DataTypes.STRING,
    },
    key_city: {
      type: DataTypes.INTEGER,
    },
    key_province: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: false }
);

// PostalCodeModel.hasMany(AddressModel, {
//   foreignKey: "postal_code",
//   as: "lala",
//   sourceKey: "postal_code",
// });
// AddressModel.belongsTo(PostalCodeModel, {
//   foreignKey: "postal_code",
//   as: "lala",
//   targetKey: "postal_code",
// });

PostalCodeModel.hasMany(WarehouseModel, {
  foreignKey: "postal_code",
  as: "kodepos",
  sourceKey: "postal_code",
});
WarehouseModel.belongsTo(PostalCodeModel, {
  foreignKey: "postal_code",
  as: "kodepos",
  targetKey: "postal_code",
});

module.exports = PostalCodeModel;
