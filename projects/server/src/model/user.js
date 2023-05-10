const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;
const WarehouseAdminModel = require("./Warehouse_admin");
const WarehouseModel = require("./warehouse");

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
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

UserModel.hasOne(WarehouseAdminModel, {
  foreignKey: "id_user",
  sourceKey: "id_user",
  as: 'warehouseAdmin',
});

WarehouseModel.hasOne(WarehouseAdminModel, {
  foreignKey: 'id_warehouse',
  as: 'warehouseAdmin',
});

WarehouseAdminModel.belongsTo(UserModel, {
  foreignKey: 'id_user',
  as: 'user',
});

WarehouseAdminModel.belongsTo(WarehouseModel, {
  foreignKey: 'id_warehouse',
  as: 'warehouse',
});

module.exports = UserModel;
