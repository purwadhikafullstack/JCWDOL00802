const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");

const { DataTypes } = Sequelize;

const UserModel = dbSequelize.define(
  "user",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    role: {
      type: DataTypes.INTEGER,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    profile_picture: {
      type: DataTypes.STRING,
    },
    full_name: {
      type: DataTypes.STRING,
    },
    subs: {
      type: DataTypes.INTEGER,
    },
    reset_request: {
      type: DataTypes.INTEGER,
    },
    count: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = UserModel;
