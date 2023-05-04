const express = require("express");
const route = express.Router();
const { ProductController, authorizeController } = require("../controllers");
const { uploader } = require("../config/uploader");

//ROUTE

route.get(
  "/sales",
  authorizeController.authAdmin,
  ProductController.getProductSales
);
route.get("/category", ProductController.getCategory);
route.get(
  "/warehouse",
  authorizeController.authAdmin,
  ProductController.getWarehouse
);

route.post(
  "/list",
  authorizeController.authAdmin,
  ProductController.getProductAdmin
);

route.get(
  "/detailproduct",
  authorizeController.authAdmin,
  ProductController.getDetailProductsAdmin
);
route.post(
  "/editproduct",
  authorizeController.authSuperAdmin,
  uploader("/product").single("product_picture"),
  ProductController.editProducts
);
route.post(
  "/addproduct",
  authorizeController.authSuperAdmin,
  uploader("/product").single("product_picture"),
  ProductController.newProducts
);
route.post(
  "/deleteproduct",
  authorizeController.authSuperAdmin,
  ProductController.deleteProducts
);
route.post("/stockhistory", ProductController.getStockHistory);
route.post(
  "/stockhistorydetail",
  authorizeController.authAdmin,
  ProductController.getStockHistoryDetail
);

route.post("/categorylist", ProductController.getCategoryList);
route.post(
  "/categoryadd",
  authorizeController.authSuperAdmin,
  uploader("/category").single("category_picture"),
  ProductController.addCategory
);
route.post(
  "/categoryedit",
  authorizeController.authSuperAdmin,
  uploader("/category").single("category_picture"),
  ProductController.editCategory
);
route.post(
  "/categorydelete",
  authorizeController.authSuperAdmin,
  ProductController.deleteCategory
);
route.get("/detail", ProductController.getProductDetail);

//
route.get(
  "/warehousemuattionstatus",
  authorizeController.authAdmin,
  ProductController.getWarehouseMutationStatus
);

route.post(
  "/stockedit",
  authorizeController.authAdmin,
  ProductController.editStock
);

route.get(
  "/warehousefrom",
  authorizeController.authAdmin,
  ProductController.getWarehouseRequestFrom
);

route.get(
  "/stockfrom",
  authorizeController.authAdmin,
  ProductController.getStockFrom
);

route.post(
  "/getmutation",
  authorizeController.authAdmin,
  ProductController.getMutation
);

route.post(
  "/stockmoverequest",
  authorizeController.authAdmin,
  ProductController.requestMoveStock
);

route.post(
  "/approvestockmove",
  authorizeController.authAdmin,
  ProductController.approveStockMove
);

route.post(
  "/rejectstockmove",
  authorizeController.authAdmin,
  ProductController.rejectStockMove
);

route.post(
  "/sendstockmove",
  authorizeController.authAdmin,
  ProductController.sendStockMove
);

route.post(
  "/acceptedstockmove",
  authorizeController.authAdmin,
  ProductController.acceptedStockMove
);

module.exports = route;
