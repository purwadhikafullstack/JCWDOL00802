const express = require("express");
const route = express.Router();
const { uploader } = require("../config/uploader");
const { authorizeController, PromosController } = require("../controllers");

route.post(
  "/addpromo",
  authorizeController.authSuperAdmin,
  uploader("/promo").single("promo_picture"),
  PromosController.addPromo
);

route.get("/getpromo", PromosController.getPromo);

route.post(
  "/getpromolist",
  authorizeController.authSuperAdmin,
  PromosController.getPromoList
);

route.get(
  "/detailpromo",
  authorizeController.authSuperAdmin,
  PromosController.getIdPromo
);

route.post(
  "/editpromo",
  authorizeController.authSuperAdmin,
  uploader("/promo").single("promo_picture"),
  PromosController.editPromo
);

route.get("/getpromolanding", PromosController.getPromoLanding);

module.exports = route;
