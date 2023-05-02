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
        console.log("enddate", endDate);
        console.log("start", startDate);
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
            amount: stock,
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
            amount: stock,
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
            amount: total,
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
            amount: total,
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
    }
    return res.status(200).send({
      success: true,
      message: "done",
    });
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
      let trans = await TransactionModel.findOne({ where: { id_transaction } });
      let transDetail = await TransactionDetailModel.findAll({
        where: { id_transaction },
      });
      res.status(200).send({
        transaction: trans,
        detailTransaction: transDetail,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
