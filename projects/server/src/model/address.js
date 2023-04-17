const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");

const { DataTypes } = Sequelize;

const AddressModel = dbSequelize.define(
  "address",
  {
    id_address: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
    },
    coordinate_lat: {
      type: DataTypes.INTEGER,
    },
    coordinate_long: {
      type: DataTypes.INTEGER,
    },
    detail_address: {
      type: DataTypes.STRING,
    },
    postal_code: {
      type: DataTypes.INTEGER,
    },
    priority: {
      type: DataTypes.TINYINT,
    },
  },
  { timestamps: false }
);

module.exports = AddressModel;
