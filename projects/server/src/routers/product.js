const express = require("express");
const route = express.Router();
const { readAdmin } = require("../config/encript");
const { ProductController, authorizeController } = require("../controllers");
const multer = require("multer");

//MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/img/product/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only jpg, png, and jpeg files
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only jpg, png, and jpeg files are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

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

route.get("/detailproduct", ProductController.getDetailProducts);
route.post(
  "/editproduct",
  authorizeController.authSuperAdmin,
  upload.single("product_picture"),
  ProductController.editProducts
);
route.post(
  "/addproduct",
  authorizeController.authSuperAdmin,
  upload.single("product_picture"),
  ProductController.newProducts
);
route.post("/deleteproduct", ProductController.deleteProducts);
route.post("/stockhistory", ProductController.getStockHistory);
route.post(
  "/stockhistorydetail",
  authorizeController.authAdmin,
  ProductController.getStockHistoryDetail
);

module.exports = route;
