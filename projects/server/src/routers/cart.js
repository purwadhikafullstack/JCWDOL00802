const express = require("express");
const route = express.Router();
const { cartController } = require("../controllers");
const {
  authUser,
  authUserCart,
  authUserCartDel,
} = require("../controllers/authorize");

route.post("/addtocart", cartController.AddtoCart);
route.get("/getcart", authUser, cartController.getCart);
route.get("/selected", authUser, cartController.getCartSelected);
route.get("/detail/", cartController.getCartDetail);
route.post("/inc", authUserCart, cartController.cartIncrement);
route.post("/dec", authUserCart, cartController.cartDecrement);
route.post("/updatecart", cartController.cartSelected);
route.get("/allcartselect", authUser, cartController.cartAllSelected);
route.get("/allcartunselect", authUser, cartController.cartAllUnselected);
route.delete("/", authUserCartDel, cartController.cartDelete);
module.exports = route;
