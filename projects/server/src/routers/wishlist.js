const express = require("express");
const { wishlistController } = require("../controllers");
const { authNonAdmin } = require("../controllers/authorize");
const route = express.Router();

route.get("/", authNonAdmin, wishlistController.getWishlist);
route.get("/checker", authNonAdmin, wishlistController.checkerWishlist);
route.post("/wish", authNonAdmin, wishlistController.addWishlist);
route.post("/cart", authNonAdmin, wishlistController.moveToCart);
route.delete("/wish", authNonAdmin, wishlistController.removeWishist);

module.exports = route;
