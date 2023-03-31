const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");

const { DataTypes } = Sequelize;

const UserRoleModel = dbSequelize.define(
  "user_role",
  {
    role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = UserRoleModel;
