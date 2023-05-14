const UserModel = require("../model/user");
const TransactionModel = require("../model/transaction");
const WarehouseModel = require("../model/warehouse");
const WarehouseAdminModel = require("../model/Warehouse_admin");
const WarehouseMutationModel = require("../model/warehouse_mutation");
const StockModel = require("../model/stock");
const ProductModel = require("../model/Product");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

module.exports = {
  getTotalUsers: async (req, res) => {
    try {
      if (req.decript.role !== 3) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      const totalUsers = await UserModel.count({ where: { role: 1 } });
      const totalWarehouseAdmins = await UserModel.count({
        where: { role: 2 },
      });
      const totalWarehouses = await WarehouseModel.count(); 
      return res.json({ totalUsers, totalWarehouseAdmins, totalWarehouses });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getTotalIncome: async (req, res) => {
    try {
      const queryOptions = {
        where: { transaction_status: 7 },
        attributes: [
          "warehouse_sender",
          [
            TransactionModel.sequelize.fn(
              "SUM",
              TransactionModel.sequelize.col("total_price")
            ),
            "total_income",
          ],
        ],
      };

      if (req.decript.role === 2) {
        const warehouseAdmin = await WarehouseAdminModel.findOne({
          where: { id_user: req.decript.id_user },
        });
        queryOptions.where.warehouse_sender = warehouseAdmin.id_warehouse;
      } else if (req.decript.role !== 3) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      const totalIncome = await TransactionModel.findAll({
        ...queryOptions,
        group: ["warehouse_sender"],
      });
      if (req.decript.role === 3) {
        const totalIncomeAllWarehouses = totalIncome.reduce((acc, curr) => {
          return acc + parseInt(curr.get("total_income"));
        }, 0);
        return res.json({ totalIncome, totalIncomeAllWarehouses });
      } else {
        return res.json({ totalIncome });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getTotalWarehousesWithoutAdmin: async (req, res) => {
    try {
      if (req.decript.role !== 3) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
  
      const warehouseAdmins = await WarehouseAdminModel.findAll({
        attributes: ['id_warehouse'],
        raw: true
      });
  
      const warehouseAdminIds = warehouseAdmins.map(admin => admin.id_warehouse);
  
      const totalWarehousesWithoutAdmin = await WarehouseModel.count({
        where: {
          id_warehouse: {
            [Op.notIn]: warehouseAdminIds
          }
        }
      });
  
      return res.json({ totalWarehousesWithoutAdmin });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getTotalOrders: async (req, res) => {
    try {
      const queryOptions = {
        where: { transaction_status: 7 },
        attributes: [
          "warehouse_sender",
          [
            TransactionModel.sequelize.fn(
              "COUNT",
              TransactionModel.sequelize.col("id_transaction")
            ),
            "total_orders",
          ],
        ],
      };
      if (req.decript.role === 2) {
        const warehouseAdmin = await WarehouseAdminModel.findOne({
          where: { id_user: req.decript.id_user },
        });
        queryOptions.where = { warehouse_sender: warehouseAdmin.id_warehouse };
      } else if (req.decript.role !== 3) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      const totalOrders = await TransactionModel.findAll({
        ...queryOptions,
        group: ["warehouse_sender"],
      });
      if (req.decript.role === 3) {
        const allWarehousesTotalOrders = totalOrders.reduce(
          (accumulator, current) =>
            accumulator + parseInt(current.get("total_orders")),
          0
        );
        return res.json({ totalOrders, allWarehousesTotalOrders });
      } else {
        return res.json({ totalOrders });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getPendingRequests: async (req, res) => {
    try {
      if (req.decript.role !== 2) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const warehouseAdmin = await WarehouseAdminModel.findOne({
        where: { id_user: req.decript.id_user },
      });
      const totalPendingRequests = await WarehouseMutationModel.count({
        where: { id_warehouse_sender: warehouseAdmin.id_warehouse, status: 2 },
      });
      return res.json({ totalPendingRequests });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getListPendingRequests: async (req, res) => {
    try {
      if (req.decript.role !== 2) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
  
      const warehouseAdmin = await WarehouseAdminModel.findOne({
        where: { id_user: req.decript.id_user },
      });
      const pendingRequests = await WarehouseMutationModel.findAll({
        where: { id_warehouse_sender: warehouseAdmin.id_warehouse, status: 2 },
        include: [
          { model: ProductModel, as: 'Product' },
          { model: WarehouseModel, as: 'receiver' },
        ],
      });
  
      // Define the time threshold for considering a request as new
      const newRequestThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const currentTime = new Date();
  
      // Add is_new property to the pending requests based on the creation date
      const modifiedPendingRequests = pendingRequests.map((request) => {
        const timeDifference = currentTime - new Date(request.date);
        const is_new = timeDifference <= newRequestThreshold;
        // Convert Sequelize instance to plain JavaScript object
        const plainRequest = request.toJSON();
        return { ...plainRequest, is_new };
      });
  
      return res.json({ pendingRequests: modifiedPendingRequests });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  
  getEmptyStockProducts: async (req, res) => {
    try {
      if (req.decript.role !== 2) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      const warehouseAdmin = await WarehouseAdminModel.findOne({
        where: { id_user: req.decript.id_user },
      });
      const emptyStockProducts = await StockModel.findAll({
        where: {
          id_warehouse: warehouseAdmin.id_warehouse,
          stock: 0,
        },
        include: [
          {
            model: ProductModel,
            attributes: [
              "id_product",
              "name",
              "description",
              "price",
              "weight",
              "product_picture",
            ],
          },
        ],
      });
      if (emptyStockProducts.length === 0) {
        return res.json({ message: "There's no empty stock" });
      } else {
        return res.json({ emptyStockProducts });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getNewOrders : async (req, res) => {
    try {
      const warehouseAdmin = await WarehouseAdminModel.findOne({
        where: { id_user: req.decript.id_user },
      });
  
      const newOrdersCount = await TransactionModel.count({
        where: {
          transaction_status: 1,
          warehouse_sender: warehouseAdmin.id_warehouse,
        },
      });
  
      res.json({
        success: true,
        newOrdersCount,
      });
    } catch (error) {
      console.error("Error fetching new orders count:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching new orders count.",
      });
    }
  },

  getReadyForShipment : async (req, res) => {
    try {
      const warehouseAdmin = await WarehouseAdminModel.findOne({
        where: { id_user: req.decript.id_user },
      });
  
      const readyForShipmentCount = await TransactionModel.count({
        where: {
          transaction_status: 5,
          warehouse_sender: warehouseAdmin.id_warehouse,
        },
      });
  
      res.json({
        success: true,
        readyForShipmentCount,
      });
    } catch (error) {
      console.error("Error fetching ready for shipment count:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching ready for shipment count.",
      });
    }
  }
}


