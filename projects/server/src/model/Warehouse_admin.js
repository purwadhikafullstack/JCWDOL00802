const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const WarehouseModel = require("./warehouse");
const { DataTypes } = Sequelize;

const WarehouseAdminModel = dbSequelize.define(
  "Warehouse_admin",
  {
    id_warehouse_admin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
    },
    id_warehouse: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: false }
);

const associateWarehouseAdminModel = (UserModel, WarehouseModel) => {
  WarehouseAdminModel.belongsTo(UserModel, {
    foreignKey: 'id_user',
    as: 'user',
  });

  WarehouseAdminModel.belongsTo(WarehouseModel, {
    foreignKey: 'id_warehouse',
    as: 'warehouse',
  });
};


module.exports = {
  WarehouseAdminModel,
  associateWarehouseAdminModel,
};

