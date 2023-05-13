const express = require("express");
const route = express.Router();
const { cartController } = require("../controllers");
const {
  authUser,
  authUserCart,
  authUserCartDel,
  authNonAdmin,
} = require("../controllers/authorize");

route.post("/addtocart", authNonAdmin, cartController.AddtoCart);
route.get("/getcart", authNonAdmin, cartController.getCart);
route.get("/selected", authNonAdmin, cartController.getCartSelected);
route.get("/detail/", authNonAdmin, cartController.getCartDetail);
route.post("/inc", authUserCart, cartController.cartIncrement);
route.post("/dec", authUserCart, cartController.cartDecrement);
route.post("/updatecart", authNonAdmin, cartController.cartSelected);
route.get("/allcartselect", authNonAdmin, cartController.cartAllSelected);
route.get("/allcartunselect", authNonAdmin, cartController.cartAllUnselected);
route.delete("/", authUserCartDel, cartController.cartDelete);
module.exports = route;
