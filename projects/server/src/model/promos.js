const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const PromosModel = dbSequelize.define(
  "Promos",
  {
    id_promo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    count: {
      type: DataTypes.INTEGER,
    },
    max_count: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    limitation: {
      type: DataTypes.INTEGER,
    },
    expire_date: {
      type: DataTypes.DATE(0),
    },
    promo_code: {
      type: DataTypes.STRING,
    },
    promo_picture: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    discounted_percentage: {
      type: DataTypes.INTEGER,
    },
    count_user: {
      type: DataTypes.INTEGER,
    },
    category: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: false }
);

module.exports = PromosModel;
