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
    isDeleted: {
      type: DataTypes.TINYINT,
    },
    receiver: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

module.exports = AddressModel;
