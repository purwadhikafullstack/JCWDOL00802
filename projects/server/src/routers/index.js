const express = require("express");
const userRouter = require("./user");
const productRouter = require("./product");
const TransactionRouter = require("./transaction");

const router = express.Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/trans", TransactionRouter);

module.exports = router;
