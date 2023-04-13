const express = require("express");
const route = express.Router();
const { readAdmin } = require("../config/encript");
const { ProductController, authorizeController } = require("../controllers");
const multer = require("multer");

//MULTER PRODUCT
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

//MULTER CATEGORY
const storageCategory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/img/category/");
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

const fileFilterCategory = (req, file, cb) => {
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

const uploadCategory = multer({
  storage: storageCategory,
  fileFilter: fileFilterCategory,
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

route.post("/categorylist", ProductController.getCategoryList);
route.post(
  "/categoryadd",
  authorizeController.authSuperAdmin,
  uploadCategory.single("category_picture"),
  ProductController.addCategory
);
route.post(
  "/categoryedit",
  authorizeController.authSuperAdmin,
  uploadCategory.single("category_picture"),
  ProductController.editCategory
);
route.post(
  "/categorydelete",
  authorizeController.authSuperAdmin,
  ProductController.deleteCategory
);
module.exports = route;
