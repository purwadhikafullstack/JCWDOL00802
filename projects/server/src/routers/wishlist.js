const express = require("express");
const { wishlistController } = require("../controllers");
const { authUser } = require("../controllers/authorize");
const route = express.Router();

route.get("/", authUser, wishlistController.getWishlist);
route.get("/checker", authUser, wishlistController.checkerWishlist);
route.post("/wish", authUser, wishlistController.addWishlist);
route.post("/cart", authUser, wishlistController.moveToCart);
route.delete("/wish", authUser, wishlistController.removeWishist);

module.exports = route;
