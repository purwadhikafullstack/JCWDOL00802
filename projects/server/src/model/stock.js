const { Sequelize } = require('sequelize');
const { dbSequelize } = require('../config/db');

const { DataTypes } = Sequelize;

const StockModel = dbSequelize.define('Stock', {
    id_stock: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_warehouse: {
        type: DataTypes.INTEGER
    },
    id_product: {
        type: DataTypes.INTEGER
    },
    stock: {
        type: DataTypes.INTEGER
    },
    
}, {  timestamps: false
});

module.exports = StockModel