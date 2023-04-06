const sequelize = require("sequelize");
const Axios = require("axios");
const TransactionStatusModel = require("../model/transaction_status");
const TransactionDetailModel = require("../model/transaction_detail");
const TransactionModel = require("../model/transaction");
const ProductModel = require("../model/Product");

module.exports = {
  getTransaction: async (req, res) => {
    try {
      let data = await TransactionModel.findAll({
        where: { id_user: req.decript.id_user },

        include: [
          {
            model: TransactionStatusModel,
          },
          {
            model: TransactionDetailModel,

            include: [
              {
                model: ProductModel,
              },
            ],
          },
        ],
        order: [["id_transaction", "desc"]],
      }).then((response) => {
        return res.status(200).send(response);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
