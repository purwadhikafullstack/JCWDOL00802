const sequelize = require("sequelize");
const Axios = require("axios");
const TransactionStatusModel = require("../model/transaction_status");
const TransactionDetailModel = require("../model/transaction_detail");
const TransactionModel = require("../model/transaction");
const ProductModel = require("../model/Product");
const { StockModel, WarehouseModel, PostalCodeModel } = require("../model");
const StockHistoryModel = require("../model/stock_history");
const WarehouseMutationModel = require("../model/warehouse_mutation");
const CartModel = require("../model/Cart");
const AddressModel = require("../model/address");
const WarehouseAdminModel = require("../model/Warehouse_admin");
const UserModel = require("../model/user");
const { transporter } = require("../config/nodemailer");
const { Op } = require("sequelize");
const cron = require("node-cron");

module.exports = {
  getTransaction: async (req, res) => {
    try {
      let filterProduct = {};
      let filterTransaction = { id_user: req.decript.id_user };
      let limit = parseInt(req.query.limit);
      let page = parseInt(req.query.page);
      let search = req.body.search;
      let month = req.body.month;
      let year = req.body.year;
      let status = req.body.status;
      let offset = limit * page;
      let searchTracker = false;

      if (search !== "" && typeof search !== "undefined") {
        filterProduct.name = {
          [sequelize.Op.like]: [`%${search}%`],
        };
        searchTracker = true;
      }

      if (
        month !== "" &&
        typeof month !== "undefined" &&
        year !== "" &&
        typeof year !== "undefined"
      ) {
        let startDate = new Date(`${parseInt(year)}-${parseInt(month)}-01`);
        let endDate =
          parseInt(month) < 12
            ? new Date(`${parseInt(year)}-${parseInt(month) + 1}-01`)
            : new Date(`${parseInt(year) + 1}-1-01`);
        filterTransaction.date = {
          [sequelize.Op.and]: {
            [sequelize.Op.gte]: startDate,
            [sequelize.Op.lt]: endDate,
          },
        };
      }

      if (status !== "" && typeof status !== "undefined") {
        if (status == "ongoing") {
          filterTransaction.transaction_status = {
            [sequelize.Op.or]: [1, 2, 3, 4, 5, 6],
          };
        } else if (status == "waiting") {
          filterTransaction.transaction_status = 1;
        } else {
          filterTransaction.transaction_status = status;
        }
      }

      let data = await TransactionModel.findAndCountAll({
        where: filterTransaction,
        limit,
        offset,
        page,
        distinct: true,
        col: "id_transaction",
        include: [
          {
            model: TransactionStatusModel,
          },
          {
            model: TransactionDetailModel,

            include: [
              {
                model: ProductModel,
                where: filterProduct,
              },
            ],
          },
        ],
        order: [["id_transaction", "desc"]],
      });
      let result = data.rows;
      let total_item = data.count;
      if (searchTracker) {
        let data = await TransactionModel.findAll({
          where: filterTransaction,
          limit,
          offset,
          page,
          include: [
            {
              model: TransactionStatusModel,
            },
            {
              model: TransactionDetailModel,

              include: [
                {
                  model: ProductModel,
                  where: filterProduct,
                },
              ],
            },
          ],
          order: [["id_transaction", "desc"]],
        });
        total_item = data.length;
      }
      let total_page = Math.ceil(total_item / limit);
      res.status(200).send({
        data: result,
        page,
        total_page,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  addTrans: async (req, res) => {
    const closestLocation = (targetLocation, locationData) => {
      const vectorDistance = (dx, dy) => {
        return Math.sqrt(dx * dx + dy * dy);
      };

      const locationDistance = (location1, location2) => {
        var dx =
            parseInt(location1.coordinate_lat) -
            parseInt(location2.coordinate_lat),
          dy =
            parseInt(location1.coordinate_long) -
            parseInt(location2.coordinate_long);

        return vectorDistance(dx, dy);
      };

      return locationData.reduce(function (prev, curr) {
        var prevDistance = locationDistance(targetLocation, prev),
          currDistance = locationDistance(targetLocation, curr);
        return prevDistance < currDistance ? prev : curr;
      });
    };
    const cekStock = async (
      id_product,
      id_warehouse,
      total,
      destiny,
      date,
      reference
    ) => {
      let cekStok = await StockModel.findAll({
        where: { id_product, id_warehouse },
      });
      let stock = cekStok[0].stock;

      if (stock < total) {
        total -= stock;
        if (id_warehouse != destiny) {
          await WarehouseMutationModel.create({
            id_product,
            id_warehouse_sender: id_warehouse,
            id_warehouse_receiver: destiny,
            date: date,
            reference,
            status: 1,
            total_item: stock,
          });

          let totalCek = await StockHistoryModel.findAll({
            limit: 1,
            order: [["date", "desc"]],
            where: { id_product, id_warehouse },
          });
          let newTotal = totalCek[0].total - stock;
          await StockHistoryModel.create({
            id_product,
            id_warehouse,
            amount: parseInt(`-${stock}`),
            total: newTotal,
            date: date,
            type: 4,
          });
        } else if (id_warehouse == destiny && stock != 0) {
          let totalCek = await StockHistoryModel.findAll({
            limit: 1,
            order: [["date", "desc"]],
            where: { id_product, id_warehouse },
          });
          let newTotal = totalCek[0].total - stock;
          await StockHistoryModel.create({
            id_product,
            id_warehouse,
            amount: parseInt(`-${stock}`),
            total: newTotal,
            date: date,
            type: 5,
          });
        }
        await StockModel.decrement(
          { stock: stock },
          { where: { id_product, id_warehouse } }
        );
        let cekWarehouse = await WarehouseModel.findAll({
          raw: true,
          include: [
            {
              model: StockModel,
              attributes: [],
              where: {
                stock: {
                  [sequelize.Op.gt]: [0],
                },
                id_product,
              },
            },
          ],
        });
        dataCek = cekWarehouse.filter(
          (e) => e.id_warehouse != id_warehouse && e.id_warehouse != destiny
        );
        let datawarehouse = await WarehouseModel.findAll({
          raw: true,
          where: { id_warehouse },
        });
        let dataAwal = {
          coordinate_lat: datawarehouse[0].coordinate_lat,
          coordinate_long: datawarehouse[0].coordinate_long,
        };
        let data = closestLocation(dataAwal, dataCek);
        cekStock(
          id_product,
          data.id_warehouse,
          total,
          destiny,
          date,
          reference
        );
      } else if (stock >= total) {
        StockModel.decrement(
          { stock: total },
          { where: { id_product, id_warehouse } }
        );
        if (id_warehouse != destiny) {
          await WarehouseMutationModel.create({
            id_product,
            id_warehouse_sender: id_warehouse,
            id_warehouse_receiver: destiny,
            date: date,
            reference,
            status: 1,
            total_item: total,
          });

          let totalCek = await StockHistoryModel.findAll({
            limit: 1,
            order: [["date", "desc"]],
            where: { id_product, id_warehouse },
          });
          let newTotal = totalCek[0].total - total;
          await StockHistoryModel.create({
            id_product,
            id_warehouse,
            amount: parseInt(`-${total}`),
            total: newTotal,
            date,
            type: 4,
          });
        } else if (id_warehouse == destiny) {
          let totalCek = await StockHistoryModel.findAll({
            limit: 1,
            order: [["date", "desc"]],
            where: { id_product, id_warehouse },
          });
          let newTotal = totalCek[0].total - total;
          await StockHistoryModel.create({
            id_product,
            id_warehouse,
            amount: parseInt(`-${total}`),
            total: newTotal,
            date,
            type: 5,
          });
        }
        total = 0;
      }
    };
    try {
      let { shipment_fee, shipment_service, total_price, weight } = req.body;
      let address = "";
      let id_user = req.decript.id_user;
      let id_warehouse = 0;
      let date = new Date();
      let checker = [];

      let cartfind = await CartModel.findAll({
        where: {
          [sequelize.Op.and]: [{ selected: 1 }, { id_user }],
        },
        include: [
          {
            model: ProductModel,
          },
        ],
      });
      for (let j = 0; j < cartfind.length; j++) {
        let stockChecker = await ProductModel.findOne({
          where: { id_product: cartfind[j].id_product },
          raw: true,
          attributes: [[sequelize.fn("sum", sequelize.col("stock")), "jumlah"]],
          include: [
            {
              model: StockModel,
              as: "stocks",
              attributes: [],
            },
          ],
        });

        if (stockChecker.jumlah >= cartfind[j].total_item) {
          checker.push(j);
        }
      }
      if (checker.length == cartfind.length && cartfind.length != 0) {
        let findAddress = await AddressModel.findAll({
          where: { id_user, priority: 1 },
        });

        let findWarehouse = await WarehouseModel.findAll({});

        let closestWarehouse = closestLocation(findAddress[0], findWarehouse);
        id_warehouse = closestWarehouse.id_warehouse;
        address = findAddress[0].id_address;
        let addTrans = await TransactionModel.create({
          date,
          shipment_fee,
          shipment_service,
          total_price,
          weight,
          address,
          id_user,
          warehouse_sender: id_warehouse,
          number_item: cartfind.length,
        });
        let transId = await TransactionModel.findAll({
          limit: 1,
          raw: true,
          order: [["id_transaction", "desc"]],
          where: { id_user },
        });
        let id_trans = transId[0].id_transaction;
        for (let i = 0; i < cartfind.length; i++) {
          let total = cartfind[i].total_item;
          let id_product = cartfind[i].id_product;
          let id_cart = cartfind[i].id_cart;
          await cekStock(
            id_product,
            id_warehouse,
            total,
            id_warehouse,
            date,
            id_trans
          );
          let detailAdd = await TransactionDetailModel.create({
            id_transaction: id_trans,
            id_product,
            total_item: total,
            purchased_price: cartfind[i].Product.price,
            total_purchased_price: total * cartfind[i].Product.price,
          });
          let cartdel = await CartModel.destroy({ where: { id_cart } });
        }
        return res.status(201).send("oke");
      } else if (checker.length != cartfind.length) {
        return res.status(400).send("tidak cukup");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  changeStatusTrans: async (req, res) => {
    try {
      let text = " ";

      let id_transaction = req.query.id;
      let transaction_status = req.query.stat;
      let acc = await TransactionModel.update(
        { transaction_status },
        {
          where: {
            id_transaction,
          },
        }
      );
      if (transaction_status == 7) {
        text = "status pesanan berubah menjadi diterima";
      }
      if (transaction_status == 8) {
        text = "komplain page telah dibuat";
      }
      if (transaction_status == 9) {
        let getTrans = await TransactionModel.findAll({
          where: { id_transaction },
        });
        let id = getTrans[0].warehouse_sender;
        let getdetail = await TransactionDetailModel.findAll({
          where: { id_transaction: req.query.id },
        });
        for (let i = 0; i < getdetail.length; i++) {
          let total = getdetail[i].total_item;
          let id_product = getdetail[i].id_product;
          let date = new Date();
          let findMutation = await WarehouseMutationModel.findAll({
            where: { status: 1, reference: id_transaction },
            raw: true,
          });
          if (findMutation.length > 0) {
            for (let i = 0; i < findMutation.length; i++) {
              let id_mutation = findMutation[i].id_mutation;
              let id_warehouse = findMutation[i].id_warehouse_sender;
              let amount = findMutation[i].total_item;

              let updateMutation = await WarehouseMutationModel.update(
                { status: 7 },
                { where: { id_mutation } }
              );
              let totalCek = await StockHistoryModel.findAll({
                limit: 1,
                order: [["date", "desc"]],
                where: { id_product, id_warehouse },
              });
              let newTotal = totalCek[0].total + amount;
              let updateStockHistory = await StockHistoryModel.create({
                id_product,
                id_warehouse,
                amount,
                total: newTotal,
                date,
                type: 6,
              });
              let updateStock = await StockModel.increment(
                { stock: amount },
                {
                  where: { id_product, id_warehouse },
                }
              );
              total -= amount;
            }
          }
          let totalCek = await StockHistoryModel.findAll({
            limit: 1,
            order: [["date", "desc"]],
            where: { id_product, id_warehouse: id },
          });
          let newTotal = totalCek[0].total + total;
          let updateStockWarehouseSender = await StockHistoryModel.create({
            id_product,
            id_warehouse: id,
            amount: total,
            total: newTotal,
            date,
            type: 7,
          });
          let updateStock = await StockModel.increment(
            { stock: total },
            {
              where: { id_product, id_warehouse: id },
            }
          );
        }
        text = "berhasil membatalkan pesanan";
      }
      return res.status(200).send({
        success: true,
        message: text,
      });
    } catch (error) {}
  },
  getWarehouse: async (req, res) => {
    const closestLocation = (targetLocation, locationData) => {
      const vectorDistance = (dx, dy) => {
        return Math.sqrt(dx * dx + dy * dy);
      };

      const locationDistance = (location1, location2) => {
        var dx =
            parseInt(location1.coordinate_lat) -
            parseInt(location2.coordinate_lat),
          dy =
            parseInt(location1.coordinate_long) -
            parseInt(location2.coordinate_long);

        return vectorDistance(dx, dy);
      };

      return locationData.reduce(function (prev, curr) {
        var prevDistance = locationDistance(targetLocation, prev),
          currDistance = locationDistance(targetLocation, curr);
        return prevDistance < currDistance ? prev : curr;
      });
    };
    let id_user = req.decript.id_user;
    let findAddress = await AddressModel.findAll({
      where: { id_user, priority: 1 },
    });

    let findWarehouse = await WarehouseModel.findAll({});

    let closestWarehouse = closestLocation(findAddress[0], findWarehouse);
    let postal_code = closestWarehouse.postal_code;
    let postalFind = await PostalCodeModel.findOne({ where: { postal_code } });

    return res.status(200).send(postalFind);
  },
  getTransDetail: async (req, res) => {
    try {
      let id_transaction = req.query.id;
      let trans = await TransactionModel.findOne({
        where: { id_transaction },
        include: [
          {
            model: TransactionStatusModel,
          },
          {
            model: AddressModel,
            as: "alamat_pengiriman",
          },
        ],
      });
      let transDetail = await TransactionDetailModel.findAll({
        where: { id_transaction },
        include: [
          {
            model: ProductModel,
          },
        ],
      });
      res.status(200).send({
        transaction: trans,
        detailTransaction: transDetail,
      });
    } catch (error) {
      console.log(error);
    }
  },
  uploadProof: async (req, res) => {
    try {
      const { id_transaction } = req.query;
      const id_user = req.decript.id_user;

      const transaction = await TransactionModel.findOne({
        where: { id_transaction, id_user },
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found or doesn't belong to the user",
        });
      }

      if (transaction.transaction_status !== 1) {
        return res.status(400).json({
          success: false,
          message: "The transaction is not in 'menunggu pembayaran' status",
        });
      }

      await TransactionModel.update(
        {
          transaction_status: 2,
          transaction_proof: req.file.filename,
        },
        {
          where: { id_transaction },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Transaction proof uploaded and status updated",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error uploading transaction proof",
        error: error.message,
      });
    }
  },

  accTransaction: async (req, res) => {
    let text = " ";
    let id_transaction = req.query.id;
    try {
      let getTrans = await TransactionModel.findAll({
        where: { id_transaction },
      });
      let id = getTrans[0].warehouse_sender;
      let getdetail = await TransactionDetailModel.findAll({
        where: { id_transaction: req.query.id },
      });
      for (let i = 0; i < getdetail.length; i++) {
        let total = getdetail[i].total_item;
        let id_product = getdetail[i].id_product;
        let date = new Date();
        let findMutation = await WarehouseMutationModel.findAll({
          where: { status: 1, reference: id_transaction },
          raw: true,
        });
        if (findMutation.length > 0) {
          for (let i = 0; i < findMutation.length; i++) {
            let id_mutation = findMutation[i].id_mutation;
            let id_warehouse = findMutation[i].id_warehouse_sender;
            let amount = findMutation[i].total_item;

            let updateMutation = await WarehouseMutationModel.update(
              { status: 3 },
              { where: { id_mutation } }
            );
          }
        }
      }
      // Update the transaction status to 3 (payment accepted)
      let updateTransactionStatus = await TransactionModel.update(
        { transaction_status: 3 },
        { where: { id_transaction } }
      );

      text = "accepted";
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while processing your request.",
        error: error.message,
      });
    }
    return res.status(200).send({
      success: true,
      message: text,
    });
  },

  rejectTransaction: async (req, res) => {
    let id_transaction = req.query.id;
    try {
      // Update the transaction status from 2 (pending) to 1 (rejected)
      let updateTransactionStatus = await TransactionModel.update(
        { transaction_status: 1 },
        { where: { id_transaction, transaction_status: 2 } }
      );

      if (updateTransactionStatus[0] === 0) {
        // No rows were updated
        return res.status(400).send({
          success: false,
          message: "Transaction not found or already rejected/accepted.",
        });
      }

      return res.status(200).send({
        success: true,
        message: "Transaction has been rejected.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while processing your request.",
        error: error.message,
      });
    }
  },

  sendingPackage: async (req, res) => {
    try {
      const { id_transaction, resi } = req.body;

      let getTrans = await TransactionModel.findOne({
        where: { id_transaction },
      });
      let id = getTrans.warehouse_sender;
      let getdetail = await TransactionDetailModel.findAll({
        where: { id_transaction: req.body.id_transaction },
      });

      // Initialize temporary variable to record the total received items
      let temp = 0;

      for (let i = 0; i < getdetail.length; i++) {
        let id_product = getdetail[i].id_product;
        let date = new Date();
        let findMutation = await WarehouseMutationModel.findAll({
          where: {
            status: {
              [Op.or]: [5],
            },
            reference: id_transaction,
            id_product: id_product, // filter by product id
          },
          raw: true,
        });

        if (findMutation.length > 0) {
          for (let i = 0; i < findMutation.length; i++) {
            let id_mutation = findMutation[i].id_mutation;
            let amount = findMutation[i].total_item;

            temp += amount;
          }

          let totalCek = await StockModel.findOne({
            where: { id_product, id_warehouse: id },
          });

          let newTotal = totalCek.stock - temp;
          let updateStockWarehouseSender = await StockHistoryModel.create({
            id_product,
            id_warehouse: id,
            amount: -temp,
            total: newTotal,
            date,
            type: 5,
          });

          let updateStock = await StockModel.update(
            { stock: newTotal },
            {
              where: { id_product, id_warehouse: id },
            }
          );
          temp = 0;
        }
      }

      await TransactionModel.update(
        { resi, transaction_status: 6, date_send: new Date() },
        { where: { id_transaction } }
      );

      const transaction = await TransactionModel.findOne({
        where: { id_transaction },
        include: [
          { model: UserModel, as: "user", attributes: ["email", "full_name"] },
          {
            model: AddressModel,
            as: "alamat_pengiriman",
            attributes: ["receiver"],
          },
        ],
      });

      const job = cron.schedule(
        "0 */12 * * *",
        async () => {
          const updatedTransaction = await TransactionModel.findOne({
            where: { id_transaction },
          });

          if (updatedTransaction.transaction_status === 7) {
            
            job.stop();
            return;
          }
          const now = new Date();
          const sentDate = new Date(transaction.date_send);
          const diffDays = Math.abs(now - sentDate) / (1000 * 60 * 60 * 24);
          if (diffDays >= 7) {
            await TransactionModel.update(
              { transaction_status: 7 },
              { where: { id_transaction } }
            );
            job.stop();
          }
        },
        {
          scheduled: true,
          timezone: "Asia/Jakarta",
        }
      );
      job.start();

      // Send an email to the user
      const mailOptions = {
        from: "ClickNCollect",
        to: transaction.user.email,
        subject: "Package Shipment Confirmation",
        text: `Dear ${transaction.user.full_name},\n\nYour package with transaction ID ${transaction.id_transaction} has been shipped by ${transaction.shipment_service} on ${transaction.date_send}. The resi number is ${transaction.resi}.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
        }
      });

      res.status(200).json({ message: "Resi and transaction status updated." });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:
          "An error occurred while updating the resi and transaction status.",
      });
    }
  },

  proceedTransaction: async (req, res) => {
    let id_transaction = req.query.id;
    try {
      let getTrans = await TransactionModel.findAll({
        where: { id_transaction },
      });
      let id = getTrans[0].warehouse_sender;
      let getdetail = await TransactionDetailModel.findAll({
        where: { id_transaction: req.query.id },
      });

      let isMutationFound = false;

      for (let i = 0; i < getdetail.length; i++) {
        let total = getdetail[i].total_item;
        let id_product = getdetail[i].id_product;
        let date = new Date();
        let findMutation = await WarehouseMutationModel.findAll({
          where: { status: 3, reference: id_transaction },
          raw: true,
        });

        if (findMutation.length > 0) {
          isMutationFound = true;
          break;
        }
      }

      let updateTransactionStatus;

      if (isMutationFound) {
        updateTransactionStatus = await TransactionModel.update(
          { transaction_status: 4 },
          { where: { id_transaction, transaction_status: 3 } }
        );
      } else {
        updateTransactionStatus = await TransactionModel.update(
          { transaction_status: 5 },
          { where: { id_transaction, transaction_status: 3 } }
        );
      }

      if (updateTransactionStatus[0] === 0) {
        return res.status(400).send({
          success: false,
          message: "Transaction not found or not accepted.",
        });
      }

      return res.status(200).send({
        success: true,
        message: "Transaction has been proceeded.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while processing your request.",
        error: error.message,
      });
    }
  },

  dikemasTransaction: async (req, res) => {
    let id_transaction = req.query.id;
    try {
      // Update the transaction status from 4 (proceeded) to 5 (dikemas)
      let updateTransactionStatus = await TransactionModel.update(
        { transaction_status: 5 },
        { where: { id_transaction, transaction_status: 4 } }
      );

      if (updateTransactionStatus[0] === 0) {
        // No rows were updated
        return res.status(400).send({
          success: false,
          message: "Transaction not found or not in proceeded status.",
        });
      }

      return res.status(200).send({
        success: true,
        message: "Transaction has been marked as dikemas.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while processing your request.",
        error: error.message,
      });
    }
  },

  cancelTransaction: async (req, res) => {
    let text = " ";
    let id_transaction = req.query.id;
    try {
      let getTrans = await TransactionModel.findAll({
        where: { id_transaction },
      });
      let id = getTrans[0].warehouse_sender;
      let getdetail = await TransactionDetailModel.findAll({
        where: { id_transaction: req.query.id },
      });
      for (let i = 0; i < getdetail.length; i++) {
        let total = getdetail[i].total_item;
        let id_product = getdetail[i].id_product;
        let date = new Date();
        let findMutation = await WarehouseMutationModel.findAll({
          where: {
            status: {
              [Op.or]: [1, 3],
            },
            reference: id_transaction,
          },
          raw: true,
        });
        if (findMutation.length > 0) {
          for (let i = 0; i < findMutation.length; i++) {
            let id_mutation = findMutation[i].id_mutation;
            let id_warehouse = findMutation[i].id_warehouse_sender;
            let amount = findMutation[i].total_item;

            let updateMutation = await WarehouseMutationModel.update(
              { status: 7 },
              { where: { id_mutation } }
            );
            let totalCek = await StockHistoryModel.findAll({
              limit: 1,
              order: [["date", "desc"]],
              where: { id_product, id_warehouse },
            });
            let newTotal = totalCek[0].total + amount;
            let updateStockHistory = await StockHistoryModel.create({
              id_product,
              id_warehouse,
              amount,
              total: newTotal,
              date,
              type: 6,
            });
            let updateStock = await StockModel.increment(
              { stock: amount },
              {
                where: { id_product, id_warehouse },
              }
            );
            total -= amount;
          }
        }
        let totalCek = await StockHistoryModel.findAll({
          limit: 1,
          order: [["date", "desc"]],
          where: { id_product, id_warehouse: id },
        });
        let newTotal = totalCek[0].total + total;
        let updateStockWarehouseSender = await StockHistoryModel.create({
          id_product,
          id_warehouse: id,
          amount: total,
          total: newTotal,
          date,
          type: 7,
        });
        let updateStock = await StockModel.increment(
          { stock: total },
          {
            where: { id_product, id_warehouse: id },
          }
        );
      }
      // Update the transaction status to 9 (cancelled)
      let updateTransactionStatus = await TransactionModel.update(
        { transaction_status: 9 },
        { where: { id_transaction } }
      );

      text = "accepted";
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while processing your request.",
        error: error.message,
      });
    }
    return res.status(200).send({
      success: true,
      message: text,
    });
  },

  getOrdersAdmin: async (req, res) => {
    try {
      let search = req.body.search;
      let warehouse = req.body.warehouse;
      let role = req.decript.role;
      let urut = req.body.order;
      let page = req.body.page || 0;
      let limit = parseInt(req.body.limit) || 10;

      let transaction_status_filter = req.body.status;
      let offset = page * limit;

      let filter = {};
      let order = [["id_transaction"]];
      let filterWarehouse = {};

      if (search !== "" && typeof search !== "undefined") {
        filter["$alamat_pengiriman.receiver$"] = {
          [sequelize.Op.like]: `%${search}%`,
        };
      }

      if (
        transaction_status_filter !== "" &&
        typeof transaction_status_filter !== "undefined"
      ) {
        filter.transaction_status = transaction_status_filter;
      } else {
        // if no specific status is provided, filter for status 2, 3, 4, 5 as before
        filter.transaction_status = {
          [sequelize.Op.in]: [2, 3, 4, 5],
        };
      }

      if (urut === 0) {
        order = [["id_transaction"]];
      } else if (urut == 1) {
        order = [
          [{ model: AddressModel, as: "alamat_pengiriman" }, "receiver", "ASC"],
        ];
      } else if (urut == 2) {
        order = [
          [
            { model: AddressModel, as: "alamat_pengiriman" },
            "receiver",
            "DESC",
          ],
        ];
      } else if (urut == 3) {
        order = [["transaction_status", "ASC"]];
      } else if (urut == 4) {
        order = [["transaction_status", "DESC"]];
      }

      if (warehouse !== "" && typeof warehouse !== "undefined") {
        filterWarehouse.warehouse_sender = warehouse;
      }

      if (role == 2) {
        const find = await WarehouseAdminModel.findAll({
          where: { id_user: req.decript.id_user },
        });
        warehouse = find[0].dataValues.id_warehouse;
        filterWarehouse.warehouse_sender = warehouse;
      }

      const transactions = await TransactionModel.findAndCountAll({
        where: {
          ...filter,
          ...filterWarehouse,
        },
        order,
        limit,
        offset,
        include: [
          {
            model: TransactionStatusModel,
            as: "Transaction_status",
          },
          {
            model: AddressModel,
            as: "alamat_pengiriman",
            attributes: ["receiver"],
          },
        ],
      });

      const total_page = Math.ceil(transactions.count / limit);

      return res
        .status(200)
        .send({ data: transactions.rows, total_page, page });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  getOrderById: async (req, res) => {
    try {
      const id_user = req.decript.id_user;
      const userRole = req.decript.role;
      const id_transaction = req.query.id_transaction;

      const filter = {
        include: [
          {
            model: TransactionStatusModel,
          },
          {
            model: TransactionDetailModel,
            include: [
              {
                model: ProductModel,
                as: "Product",
              },
            ],
          },
          {
            model: AddressModel,
            as: "alamat_pengiriman", // Include UserModel
          },
          {
            model: WarehouseModel, // Include WarehouseModel
            as: "Warehouse", // Alias for the WarehouseModel
            attributes: ["warehouse_branch_name"], // Select only the name attribute
          },
        ],
        where: {
          id_transaction: id_transaction,
        },
      };

      if (userRole === 3) {
        // Superadmin
        // No additional filtering required
      } else if (userRole === 2) {
        // Warehouse admin
        const warehouseAdmin = await WarehouseAdminModel.findOne({
          where: { id_user: id_user },
        });

        if (!warehouseAdmin) {
          return res.status(404).json({ message: "Warehouse admin not found" });
        }

        filter.where.warehouse_sender = warehouseAdmin.id_warehouse;
      } else {
        return res.status(403).json({ message: "Access denied" });
      }

      const order = await TransactionModel.findOne(filter);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.transaction_proof) {
        const transactionProofPath = `https://jcwdol00802.purwadhikabootcamp.com/img/transactions/${order.transaction_proof}`;
        order.transaction_proof = transactionProofPath;
      }

      return res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
