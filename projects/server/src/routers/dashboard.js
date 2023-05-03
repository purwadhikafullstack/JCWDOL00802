const express = require("express");
const route = express.Router();
const { dashboardController } = require("../controllers");
const { authAdmin, authSuperAdmin } = require("../controllers/authorize");


route.get('/total-users', authSuperAdmin, dashboardController.getTotalUsers);
route.get('/total-income', authAdmin, dashboardController.getTotalIncome);
route.get('/total-warehouses-withoutadmin', authSuperAdmin, dashboardController.getTotalWarehousesWithoutAdmin);
route.get('/total-orders', authAdmin, dashboardController.getTotalOrders);
route.get('/pending-requests', authAdmin, dashboardController.getPendingRequests);
route.get('/empty-stock', authAdmin, dashboardController.getEmptyStockProducts);
route.get('/new-orders', authAdmin, dashboardController.getNewOrders);
route.get('/ready-for-shipment', authAdmin, dashboardController.getReadyForShipment);
route.get('/list-pending-request', authAdmin, dashboardController.getListPendingRequests);

module.exports = route;