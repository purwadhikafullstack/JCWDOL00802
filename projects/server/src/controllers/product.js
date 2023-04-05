const ProductModel = require("../model/Product");
const TransactionModel = require("../model/transaction");
const TransactionDetailModel = require("../model/transaction_detail");
const sequelize = require("sequelize");
const StockModel = require("../model/stock");
const WarehouseModel = require("../model/warehouse");
const CategoryProductModel = require("../model/Category_Product");
const WarehouseAdminModel = require("../model/Warehouse_admin");
const CategoryModel = require("../model/category");

module.exports = {
  getProductSales: async (req, res) => {
    try {
      let role = req.decript.role;
      let warehouse = req.query.warehouse;
      let search = req.query.search;
      let category = req.query.category;
      let bulan = parseInt(req.query.bulan);
      let tahun = parseInt(req.query.tahun);
      let startDate = new Date(`2023-${bulan}-01`);
      let endDate =
        bulan < 12
          ? new Date(`${tahun}-${bulan + 1}-01`)
          : new Date(`${tahun + 1}-1-31`);
      let filterWarehouse = {
        date: {
          [sequelize.Op.and]: {
            [sequelize.Op.gte]: startDate,
            [sequelize.Op.lt]: endDate,
          },
        },
        transaction_status: {
          [sequelize.Op.eq]: 7,
        },
      };
      let filterCategory = {};
      let filterName = {};

      if (warehouse !== "" && typeof warehouse !== "undefined") {
        filterWarehouse.warehouse_sender = warehouse;
      }
      if (search !== "" && typeof search !== "undefined") {
        filterName.name = {
          [sequelize.Op.like]: [`%${search}%`],
        };
      }

      if (category !== "" && typeof category !== "undefined") {
        filterCategory.id_category = category;
      }
      if (role == 2) {
        let find = await WarehouseAdminModel.findAll({
          where: { id_user: req.decript.id_user },
        });
        warehouse = find[0].dataValues.id_warehouse;
        filterWarehouse.warehouse_sender = warehouse;
      }

      const data = await ProductModel.findAll({
        where: filterName,
        group: ["id_product", "Category_Products.id_category_product"],
        attributes: [
          "id_product",
          "name",
          [
            sequelize.fn("sum", sequelize.col("prodtrans.total_item")),
            "jumlah",
          ],
          [
            sequelize.fn(
              "sum",
              sequelize.col("prodtrans.total_purchased_price")
            ),
            "total_biaya",
          ],
          [
            sequelize.fn(
              "count",
              sequelize.col("prodtrans.Transaction.id_transaction")
            ),
            "total_pesanan",
          ],
        ],
        include: [
          {
            model: TransactionDetailModel,
            as: "prodtrans",
            where: {
              total_item: { [sequelize.Op.gt]: 0 },
            },
            attributes: [],
            include: [
              {
                model: TransactionModel,
                where: filterWarehouse,

                attributes: [],
              },
            ],
          },
          {
            model: CategoryProductModel,
            where: filterCategory,
            attributes: [],
          },
        ],
      }).then((response) => {
        return res.status(201).send(response);
      });
    } catch (error) {
      console.log(error);
    }
  },
  getCategory: async (req, res) => {
    try {
      let getData = await CategoryModel.findAll().then((response) => {
        return res.status(201).send(response);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getWarehouse: async (req, res) => {
    try {
      let role = req.decript.role;
      let filterWarehouse = {};

      if (role == 2) {
        let find = await WarehouseAdminModel.findAll({
          where: { id_user: req.decript.id_user },
        });
        filterWarehouse.id_warehouse = find[0].dataValues.id_warehouse;
      }
      let getData = await WarehouseModel.findAll({
        where: filterWarehouse,
      }).then((response) => {
        return res.status(201).send(response);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
