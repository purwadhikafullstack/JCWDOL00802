const { Op } = require("sequelize");
const  UserModel  = require("../model/user");
const WarehouseModel= require("../model/warehouse");
const WarehouseAdminModel = require("../model/Warehouse_admin");
const Sequelize = require("sequelize");

module.exports = {
  assignWarehouseAdmin: async (req, res) => {
    try {
      const { id_user, id_warehouse } = req.body;
      if (!id_user || !id_warehouse) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if the user exists and has role 2
      const user = await UserModel.findOne({ where: { id_user, role: 2 } });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found or does not have role 2" });
      }

      // Check if the user is already an admin for another warehouse
      const existingUserAssignment = await WarehouseAdminModel.findOne({
        where: { id_user },
      });
      if (existingUserAssignment) {
        return res
          .status(400)
          .json({ message: "User is already assigned to another warehouse" });
      }

      // Check if the warehouse exists and if the status is not 2 (assigned)
      const warehouse = await WarehouseModel.findOne({
        where: { id_warehouse, status: { [Sequelize.Op.ne]: 2 } },
      });

      if (!warehouse) {
        return res.status(400).json({
          message: "Warehouse not found or status is 2 (assigned)",
        });
      }

      // Check if the warehouse already has an admin
      const existingAdmins = await WarehouseAdminModel.findAll({
        where: { id_warehouse, id_user: { [Sequelize.Op.ne]: null } },
      });

      if (existingAdmins && existingAdmins.length > 0) {
        return res
          .status(400)
          .json({ message: "Warehouse already has an admin" });
      }

      // Find existing warehouse admin assignment with null id_user
      const existingAssignment = await WarehouseAdminModel.findOne({
        where: { id_warehouse, id_user: null },
      });

      if (existingAssignment) {
        // Update existing warehouse admin assignment
        await WarehouseAdminModel.update(
          { id_user },
          { where: { id_warehouse, id_user: null } }
        );
      } else {
        // Create warehouse admin assignment
        await WarehouseAdminModel.create({ id_user, id_warehouse });
      }

      // Update warehouse status to 2 (assigned)
      await WarehouseModel.update({ status: 2 }, { where: { id_warehouse } });

      return res
        .status(201)
        .json({ message: "Warehouse admin assigned successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getAssignedWarehouses: async (req, res) => {
    try {
      const warehouses = await WarehouseModel.findAll({
        where: { status: 2 }, // Filter by warehouse status 2 (assigned)
        include: [
          {
            model: WarehouseAdminModel,
            as: "warehouseAdmin",
            include: [
              {
                model: UserModel,
                as: "user",
              },
            ],
          },
        ],
      });

      res.status(200).json(warehouses);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getWarehouseAdminById: async (req, res) => {
    try {
      const { id_warehouse } = req.query;

      const warehouseAdmin = await WarehouseAdminModel.findOne({
        where: { id_warehouse },
        include: [
          {
            model: UserModel,
            as: "user",
          },
          {
            model: WarehouseModel,
            as: "warehouse",
          },
        ],
      });

      if (!warehouseAdmin) {
        return res.status(404).json({
          message: "Warehouse admin not found for the given warehouse",
        });
      }

      res.status(200).json(warehouseAdmin);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  removeWarehouseAdmin: async (req, res) => {
    try {
      const { id_warehouse } = req.query;

      const warehouseAdmin = await WarehouseAdminModel.findOne({
        where: { id_warehouse },
      });

      if (!warehouseAdmin) {
        return res.status(404).json({
          message: "Warehouse admin not found for the given warehouse",
        });
      }

      // Set the id_user field to null to remove the admin association
      warehouseAdmin.id_user = null;
      await warehouseAdmin.save();

      // Update the warehouse status to 3 (deleted) in the WarehouseModel
      await WarehouseModel.update(
        { status: 1 },
        { where: { id_warehouse: id_warehouse } }
      );

      res
        .status(200)
        .json({ message: "Warehouse admin assignment removed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getUnassignedWarehouses: async (req, res) => {
    try {
      // Get the list of unassigned or deleted warehouses
      const unassignedOrDeletedWarehouses = await WarehouseModel.findAll({
        where: {
          status: {
            [Op.or]: [1, 3], // Filter by warehouse status 1 (unassign) or 3 (deleted)
          },
        },
      });

      res.status(200).json(unassignedOrDeletedWarehouses);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllWarehouses: async (req, res) => {
    try {
      const warehouses = await WarehouseModel.findAll({
        include: [
          {
            model: WarehouseAdminModel,
            as: "warehouseAdmin",
            include: [
              {
                model: UserModel,
                as: "user",
              },
            ],
          },
        ],
      });

      res.status(200).json(warehouses);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getUnassignedAdmins: async (req, res) => {
    try {
      // Get the list of assigned admin IDs
      const assignedAdmins = await WarehouseAdminModel.findAll({
        attributes: ["id_user"],
      });
      let assignedAdminIds = assignedAdmins.map(
        (warehouseAdmin) => warehouseAdmin.id_user
      );
  
      // Filter out null values
      assignedAdminIds = assignedAdminIds.filter(id => id !== null);
  
      // Get the list of unassigned admins
      const unassignedAdmins = await UserModel.findAll({
        where: {
          id_user: { [Op.notIn]: assignedAdminIds },
          role: 2, // Filter by role 2 (admin)
        },
      });
  
      res.status(200).json(unassignedAdmins);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  
};
