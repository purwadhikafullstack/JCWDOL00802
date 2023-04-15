const express = require("express");
const route = express.Router();
const { CartController } = require("../controllers");
const { authUser } = require("../controllers/authorize");

route.post("/addtocart", CartController.AddtoCart);
route.get("/getcart", authUser, CartController.getCart);
route.get("/selected", authUser, CartController.getCartSelected);
route.get("/detail/", CartController.getCartDetail);
route.post("/inc", CartController.cartIncrement);
route.post("/dec", CartController.cartDecrement);
route.post("/updatecart", CartController.cartSelected);
route.get("/allcartselect", authUser, CartController.cartAllSelected);
route.get("/allcartunselect", authUser, CartController.cartAllUnselected);
route.delete("/delete", CartController.cartDelete);
module.exports = route;
