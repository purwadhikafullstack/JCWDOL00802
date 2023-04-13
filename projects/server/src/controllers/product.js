const ProductModel = require("../model/Product");
const TransactionModel = require("../model/transaction");
const TransactionDetailModel = require("../model/transaction_detail");
const sequelize = require("sequelize");
const StockModel = require("../model/stock");
const WarehouseModel = require("../model/warehouse");
const CategoryProductModel = require("../model/Category_Product");
const WarehouseAdminModel = require("../model/Warehouse_admin");
const CategoryModel = require("../model/category");
const { Op } = require("sequelize");

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
  getProductAdmin: async (req, res) => {
    try {
      let role = req.decript.role;
      let warehouse = req.body.warehouse;
      let search = req.body.search;
      let category = req.body.category;

      let filterCategory = {};
      let filterName = {};
      let filterWarehouse = {};

      if (warehouse !== "" && typeof warehouse !== "undefined") {
        filterWarehouse.id_warehouse = warehouse;
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
        filterWarehouse.id_warehouse = warehouse;
      }

      const data = await ProductModel.findAll({
        where: filterName,

        group: ["id_product", "Category_Products.id_category_product"],
        attributes: [
          "id_product",
          "name",
          "price",
          "status",
          [sequelize.fn("sum", sequelize.col("stocks.stock")), "total_stock"],
        ],
        include: [
          {
            model: CategoryProductModel,
            where: filterCategory,
            attributes: [],
          },
          {
            model: StockModel,
            as: "stocks",
            where: filterWarehouse,
            attributes: [],
          },
        ],
      });
      return res.status(201).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  getDetailProducts: async (req, res) => {
    try {
      let { id_product } = req.query;
      let data = await ProductModel.findOne({
        where: {
          id_product,
        },
      });

      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  editProducts: async (req, res) => {
    try {
      let { id_product, name, description, price, weight, product_picture } =
        req.body;
      if (req.file) {
        product_picture = req.file.filename;
      }
      let data = await ProductModel.findAll({
        where: {
          [Op.or]: [{ name, id_product: !id_product }],
        },
      });
      if (data.length > 0) {
        res.status(400).send({
          success: false,
          msg: "Name already registered",
        });
      } else {
        let editProd = await ProductModel.update(
          { name, description, price, weight, product_picture },
          {
            where: { id_product },
          }
        );
      }
      res.status(200).send({
        success: true,
        msg: "Edit Data Success",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  deleteProducts: async (req, res) => {
    try {
      let { id_product } = req.body;

      let delProd = await ProductModel.update(
        { status: 0 },
        {
          where: { id_product },
        }
      );

      res.status(200).send({
        success: true,
        msg: "Edit Data Success",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  newProducts: async (req, res) => {
    try {
      let { name, description, price, weight, product_picture } = req.body;
      if (req.file) {
        product_picture = req.file.filename;
      }
      let data = await ProductModel.findAll({
        where: {
          [Op.or]: [{ name }],
        },
      });
      if (data.length > 0) {
        res.status(400).send({
          success: false,
          msg: "Name already registered",
        });
      } else {
        let results = await ProductModel.create({
          name,
          description,
          price,
          weight,
          product_picture,
        });

        let getWarehouse = await WarehouseModel.findAll();
        let warehouse = getWarehouse;

        warehouse.map((val, idx) => {
          let newStock = StockModel.create({
            id_warehouse: val.dataValues.id_warehouse,
            id_product: results.id_product,
            stock: 0,
          });
        });
        res.status(200).send({
          success: true,
          msg: "Add Product Success",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  getCategoryList: async (req, res) => {
    try {
      let search = req.body.search;
      let filterName = {};

      if (search !== "" && typeof search !== "undefined") {
        filterName.category = {
          [sequelize.Op.like]: [`%${search}%`],
        };
      }
      let getData = await CategoryModel.findAll({
        where: filterName,
      }).then((response) => {
        return res.status(201).send(response);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  addCategory: async (req, res) => {
    try {
      let { category, category_picture } = req.body;
      if (req.file) {
        category_picture = req.file.filename;
      }
      let check = await CategoryModel.findAll({
        where: {
          [Op.or]: [{ category }],
        },
      });

      if (check.length > 0) {
        res.status(400).send({
          success: false,
          msg: "Name already registered",
        });
      } else {
        let newCategory = await CategoryModel.create({
          category,
          category_picture,
        });
        res.status(200).send({
          success: true,
          msg: "Add Category Success",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  editCategory: async (req, res) => {
    try {
      let { id_category, category, category_picture } = req.body;
      if (req.file) {
        category_picture = req.file.filename;
      }
      let check = await CategoryModel.findAll({
        where: {
          [Op.or]: [{ category, id_category: !id_category }],
        },
      });

      if (check.length > 0) {
        res.status(400).send({
          success: false,
          msg: "Name already registered",
        });
      } else {
        let editCategory = await CategoryModel.update(
          {
            category,
            category_picture,
          },
          { where: { id_category } }
        );
        res.status(200).send({
          success: true,
          msg: "Edit Category Success",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  deleteCategory: async (req, res) => {
    try {
      let { id_category } = req.body;
      let deleteCategory = await CategoryModel.destroy({
        where: { id_category },
      });
      res.status(200).send({
        success: true,
        msg: "Delete Category Success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
