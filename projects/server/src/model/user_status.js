const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");

const { DataTypes } = Sequelize;

const UserStatusModel = dbSequelize.define(
  "user_status",
  {
    status: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = UserStatusModel;
