const jwt = require("jsonwebtoken");
const TransactionModel = require("../model/transaction");
const CartModel = require("../model/Cart");

module.exports = {
  authUser: (req, res, next) => {
    jwt.verify(req.token, "cnc!", (err, decript) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authenticate token failed",
        });
      }
      req.decript = decript;
      next();
    });
  },
  authAdmin: (req, res, next) => {
    jwt.verify(req.token, "cnc!", (err, decript) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authenticate token failed",
        });
      }
      if (decript.role == 2 || decript.role == 3) {
        req.decript = decript;
        next();
      } else {
        return res.status(401).send({
          success: false,
          message: "aha",
        });
      }
    });
  },
  authSuperAdmin: (req, res, next) => {
    jwt.verify(req.token, "cnc!", (err, decript) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authenticate token failed",
        });
      }
      if (decript.role == 3) {
        req.decript = decript;
        next();
      } else {
        return res.status(401).send({
          success: false,
          message: "bukan super admin",
        });
      }
    });
  },
  authUserTrans: (req, res, next) => {
    jwt.verify(req.token, "cnc!", async (err, decript) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authenticate token failed",
        });
      }
      let usercheck = await TransactionModel.findOne({
        where: { id_transaction: req.query.id },
      });
      req.decript = decript;

      if (usercheck.id_user == decript.id_user) {
        next();
      } else if (usercheck.id_user !== decript.id_user) {
        return res.status(401).send({
          success: false,
          message: "Not Your Transaction",
        });
      }
    });
  },
  authUserCart: (req, res, next) => {
    jwt.verify(req.token, "cnc!", async (err, decript) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authenticate token failed",
        });
      }
      let usercheck = await CartModel.findOne({
        where: { id_cart: req.body.id_cart },
      });
      req.decript = decript;
      if (usercheck.id_user == decript.id_user) {
        next();
      } else if (usercheck.id_user !== decript.id_user) {
        return res.status(401).send({
          success: false,
          message: "Not Your Transaction",
        });
      }
    });
  },
  authUserCartDel: (req, res, next) => {
    jwt.verify(req.token, "cnc!", async (err, decript) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authenticate token failed",
        });
      }
      let usercheck = await CartModel.findOne({
        where: { id_cart: req.query.id },
      });
      req.decript = decript;
      if (usercheck.id_user == decript.id_user) {
        next();
      } else if (usercheck.id_user !== decript.id_user) {
        return res.status(401).send({
          success: false,
          message: "Not Your Transaction",
        });
      }
    });
  },
};
