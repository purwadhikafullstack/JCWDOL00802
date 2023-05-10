const express = require("express");
const { warehouseAdminController } = require("../controllers");
const route = express.Router();

route.post('/assign', warehouseAdminController.assignWarehouseAdmin);
route.get('/detail', warehouseAdminController.getWarehouseAdminById);
route.delete('/remove', warehouseAdminController.removeWarehouseAdmin);
route.get('/unassigned', warehouseAdminController.getUnassignedWarehouses);
route.get('/assigned', warehouseAdminController.getAssignedWarehouses)
route.get('/listall', warehouseAdminController.getAllWarehouses)
route.get('/adminlist', warehouseAdminController.getUnassignedAdmins)

module.exports = route;
