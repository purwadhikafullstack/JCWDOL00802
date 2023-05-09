const ProductModel = require("../model/Product");
const TransactionModel = require("../model/transaction");
const TransactionDetailModel = require("../model/transaction_detail");
const sequelize = require("sequelize");
const StockModel = require("../model/stock");
const WarehouseModel = require("../model/warehouse");
const CategoryProductModel = require("../model/Category_Product");
const WarehouseAdminModel = require("../model/Warehouse_admin");
const CategoryModel = require("../model/Category");
const { Op } = require("sequelize");
const StockHistoryModel = require("../model/stock_history");
const StockHistoryTypeModel = require("../model/stock_history_type");
const { WarehouseMutationModel } = require("../model");
const WarehouseMutationStatusModel = require("../model/warehouse_mutation_status");
module.exports = {
  getProductSales: async (req, res) => {
    try {
      let role = req.decript.role;
      let warehouse = req.body.warehouse;
      let search = req.body.search;
      let category = req.body.category;
      let month = req.body.bulan;
      let year = req.body.tahun;
      let limit = parseInt(req.query.limit);
      let page = parseInt(req.query.page);
      let offset = page * limit;
      let defaultBulan = new Date().getMonth();
      let defaultYear = new Date().getFullYear();
      let startDate = new Date(
        `${defaultYear}-${defaultBulan + 1}-01 07:00:00`
      );
      let endDate = new Date();
      endDate.setDate(endDate.getUTCDate() + 1);

      if (
        year !== "" &&
        typeof year !== "undefined" &&
        month !== "" &&
        typeof month !== "undefined"
      ) {
        let bulan = parseInt(month);
        let tahun = parseInt(year);
        startDate = new Date(`2023-${bulan}-01 07:00:00`);
        endDate =
          bulan < 12
            ? new Date(`${tahun}-${bulan + 1}-01 07:00:00`)
            : new Date(`${tahun + 1}-1-01 07:00:00`);
      }

      let filterWarehouse = {
        transaction_status: {
          [sequelize.Op.eq]: 7,
        },
        date: {
          [sequelize.Op.and]: {
            [sequelize.Op.gte]: startDate,
            [sequelize.Op.lt]: endDate,
          },
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
      const counter = await ProductModel.findAndCountAll({
        where: filterName,
        limit,
        page,
        offset,
        group: ["id_product"],

        subQuery: false,

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
      });

      const total_item = counter.count.length;
      const total_page = Math.ceil(total_item / limit);
      let result = [];
      for (let i = 0; i < counter.rows.length; i++) {
        filterName.id_product = counter.rows[i].dataValues.id_product;
        const data = await ProductModel.findOne({
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
        });
        result.push(data);
      }
      let jumlah = 0;
      let total_biaya = 0;
      let total_pesanan = 0;
      for (let i = 0; i < result.length; i++) {
        jumlah += parseInt(result[i].dataValues.jumlah);
        total_biaya += parseInt(result[i].dataValues.total_biaya);
        total_pesanan += parseInt(result[i].dataValues.total_pesanan);
      }
      return res
        .status(201)
        .send({ result, jumlah, total_biaya, total_pesanan, total_page });
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
      let urut = req.body.order;

      let limit = parseInt(req.body.limit);
      let minPrice = req.body.minPrice;
      let maxPrice = req.body.maxPrice;
      let page = req.body.page;
      let result = [];
      let offset = page * limit;

      let filterCategory = {};
      let filterName = {};
      let filterWarehouse = {};

      let order = [["id_product"]];

      if (urut == 0) {
        order = [["id_product"]];
      } else if (urut == 1) {
        order = [["name", "ASC"]];
      } else if (urut == 2) {
        order = [["name", "DESC"]];
      } else if (urut == 3) {
        order = [["price", "ASC"]];
      } else if (urut == 4) {
        order = [["price", "DESC"]];
      }

      if (
        minPrice !== "" &&
        typeof minPrice !== "undefined" &&
        maxPrice !== "" &&
        typeof maxPrice !== "undefined"
      ) {
        filterName.price = {
          [Op.and]: {
            [Op.gte]: parseInt(minPrice),
            [Op.lte]: parseInt(maxPrice),
          },
        };
      } else if (minPrice !== "" && typeof minPrice !== "undefined") {
        filterName.price = {
          [Op.gte]: parseInt(minPrice),
        };
      } else if (maxPrice !== "" && typeof maxPrice !== "undefined") {
        filterName.price = {
          [Op.lte]: parseInt(maxPrice),
        };
      }

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

      const count = await ProductModel.findAndCountAll({
        where: filterName,
        limit,
        page,
        offset,
        order,
        raw: true,
        include: [
          {
            model: CategoryProductModel,
            where: filterCategory,
            attributes: [],
          },
        ],
      });

      const total_page = Math.ceil(count.count / limit);

      for (let i = 0; i < count.rows.length; i++) {
        let tempt = {};
        let id = count.rows[i].id_product;

        const data = await ProductModel.findOne({
          where: { id_product: id },
          group: ["id_product", "Category_Products.id_category_product"],
          attributes: [
            "id_product",
            "name",
            "price",
            "status",
            "product_picture",
            [sequelize.fn("sum", sequelize.col("stock")), "total_stock"],
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

        tempt.id_product = data.dataValues.id_product;
        tempt.name = data.dataValues.name;
        tempt.price = data.dataValues.price;
        tempt.status = data.dataValues.status;
        tempt.product_picture = data.dataValues.product_picture;
        tempt.total_stock = data.dataValues.total_stock;

        result.push(tempt);
      }

      return res.status(201).send({ data: result, total_page, page });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  getDetailProductsAdmin: async (req, res) => {
    try {
      let { id_product, warehouse } = req.query;
      let role = req.decript.role;
      let id_user = req.decript.id_user;
      let edit = true;
      let filterWarehouse = {};

      if (warehouse !== "" && typeof warehouse !== "undefined") {
        filterWarehouse.id_warehouse = warehouse;
      }

      if (role == 2) {
        edit = false;

        let getWarehouse = await WarehouseAdminModel.findOne({
          where: id_user,
        });
        filterWarehouse.id_warehouse = getWarehouse.id_warehouse;
      }

      let data = await ProductModel.findOne({
        where: {
          id_product,
        },
        group: ["id_product"],
        attributes: [
          "id_product",
          "name",
          "price",
          "description",
          "weight",
          "product_picture",
          [sequelize.fn("sum", sequelize.col("stocks.stock")), "stock"],
        ],
        include: [
          {
            model: CategoryProductModel,
            attributes: ["id_category"],
          },
          {
            model: StockModel,
            where: filterWarehouse,
            as: "stocks",
            attributes: [],
          },
        ],
      });

      res.status(200).send({ data, edit });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  editProducts: async (req, res) => {
    try {
      let {
        id_product,
        name,
        description,
        price,
        weight,
        product_picture,
        id_category,
      } = req.body;
      if (req.file) {
        product_picture = req.file.filename;
      }
      let data = await ProductModel.findAll({
        where: {
          [Op.and]: [{ name, id_product: { [Op.ne]: id_product } }],
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
        let editCat = await CategoryProductModel.update(
          { id_category },
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
        msg: "Delete Data Success",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  newProducts: async (req, res) => {
    try {
      let {
        name,
        description,
        price,
        weight,
        product_picture,
        id_category,
        date,
      } = req.body;
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

        let newCat = await CategoryProductModel.create({
          id_product: results.id_product,
          id_category,
        });

        let getWarehouse = await WarehouseModel.findAll();
        let warehouse = getWarehouse;

        warehouse.map((val, idx) => {
          let newStock = StockModel.create({
            id_warehouse: val.dataValues.id_warehouse,
            id_product: results.id_product,
            stock: 0,
          });

          let newStockHistory = StockHistoryModel.create({
            id_warehouse: val.dataValues.id_warehouse,
            id_product: results.id_product,
            date,
            type: 8,
            amount: 0,
            total: 0,
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
      let { search } = req.body;
      let limit = parseInt(req.body.limit);
      let page = parseInt(req.body.page);
      let filterName = {};
      let result = [];
      let offset = page * limit;
      let urut = req.body.order;

      let order = [["id_category"]];

      if (urut == 0) {
        order = [["id_category"]];
      } else if (urut == 1) {
        order = [["category", "ASC"]];
      } else if (urut == 2) {
        order = [["category", "DESC"]];
      }

      if (search !== "" && typeof search !== "undefined") {
        filterName.category = {
          [Op.like]: [`%${search}%`],
        };
      }

      let getData = await CategoryModel.findAndCountAll({
        where: filterName,
        limit,
        order,
        page,
        offset,
        raw: true,
      });
      const total_item = getData.count;
      const total_page = Math.ceil(total_item / limit);
      for (let i = 0; i < getData.rows.length; i++) {
        let tempt = {};
        tempt.id_category = getData.rows[i].id_category;
        tempt.category = getData.rows[i].category;
        tempt.category_picture = getData.rows[i].category_picture;

        result.push(tempt);
      }
      return res.status(201).send({
        data: result,
        total_page,
        page,
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
          [Op.and]: [{ category, id_category: { [Op.ne]: id_category } }],
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

      let checkProd = await CategoryProductModel.update(
        {
          id_category: 0,
        },
        { where: { id_category } }
      );
      res.status(200).send({
        success: true,
        msg: "Delete Category Success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  getStockHistoryDetail: async (req, res) => {
    try {
      let limit = parseInt(req.query.limit);
      let page = parseInt(req.query.page);
      let offset = limit * page;
      let role = req.decript.role;
      let id_user = req.decript.id_user;
      let id_product = req.query.id_product;
      let warehouse = req.body.warehouse;
      let month = req.body.bulan;
      let year = req.body.tahun;

      let defaultBulan = new Date().getMonth();
      let defaultYear = new Date().getFullYear();
      let startDate = new Date(
        `${defaultYear}-${defaultBulan + 1}-01 07:00:00`
      );
      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      if (
        year !== "" &&
        typeof year !== "undefined" &&
        month !== "" &&
        typeof month !== "undefined"
      ) {
        let bulan = parseInt(month);
        let tahun = parseInt(year);
        startDate = new Date(`${tahun}-${bulan}-01 07:00:00`);

        endDate =
          bulan < 12
            ? new Date(`${tahun}-${bulan + 1}-01 07:00:00`)
            : new Date(`${tahun + 1}-1-01 07:00:00`);
      }
      let type = req.body.type;
      let filterhistory = {
        date: {
          [sequelize.Op.and]: {
            [sequelize.Op.gte]: startDate,
            [sequelize.Op.lt]: endDate,
          },
        },
        id_product: id_product,
      };
      if (warehouse !== "" && typeof warehouse !== "undefined") {
        filterhistory.id_warehouse = warehouse;
      }
      if (role == 2) {
        let find = await WarehouseAdminModel.findAll({
          where: { id_user },
        });
        warehouse = find[0].dataValues.id_warehouse;
        filterhistory.id_warehouse = warehouse;
      }
      if (type !== "" && typeof type !== "undefined") {
        if (type === "allin") {
          filterhistory.type = {
            [sequelize.Op.or]: [1, 3, 7, 6],
          };
        } else if (type === "allout") {
          filterhistory.type = {
            [sequelize.Op.or]: [2, 4, 5],
          };
        } else {
          filterhistory.type = type;
        }
      }
      let data = await StockHistoryModel.findAndCountAll({
        where: filterhistory,
        limit,
        offset,
        page,
        include: [{ model: StockHistoryTypeModel }, { model: ProductModel }],
      });
      let stockType = await StockHistoryTypeModel.findAll({ raw: true });
      let result = data.rows;
      let total_item = data.count;
      let total_page = Math.ceil(total_item / limit);
      return res
        .status(201)
        .send({ data: result, total_page, page, stockType });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getStockHistory: async (req, res) => {
    try {
      let warehouse = req.body.warehouse;
      let role = req.decript.role;
      let id_user = req.decript.id_user;
      let order = req.body.order;
      let category = req.body.category;
      let search = req.body.search;
      let result = [];
      let limit = parseInt(req.query.limit);
      let page = parseInt(req.query.page);
      let filterCategory = {};
      let offset = page * limit;
      let month = req.body.bulan;
      let year = req.body.tahun;

      let defaultBulan = new Date().getMonth();
      let defaultYear = new Date().getFullYear();
      let startDate = new Date(
        `${defaultYear}-${defaultBulan + 1}-01 07:00:00`
      );
      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      if (
        year !== "" &&
        typeof year !== "undefined" &&
        month !== "" &&
        typeof month !== "undefined"
      ) {
        let bulan = parseInt(month);
        let tahun = parseInt(year);
        startDate = new Date(`${tahun}-${bulan}-01 07:00:00`);

        endDate =
          bulan < 12
            ? new Date(`${tahun}-${bulan + 1}-01 07:00:00`)
            : new Date(`${tahun + 1}-1-01 07:00:00`);
      }
      let filterProduct = {};
      let orderFilter = ["id_product", "asc"];
      if (search !== "" && typeof search !== "undefined") {
        filterProduct.name = {
          [sequelize.Op.like]: [`%${search}%`],
        };
      }
      if (order !== "" && typeof order !== "undefined") {
        orderFilter = order;
      }
      if (category !== "" && typeof category !== "undefined") {
        filterCategory.id_category = category;
      }
      let filterStock = {
        date: {
          [sequelize.Op.and]: {
            [sequelize.Op.gte]: startDate,
            [sequelize.Op.lt]: endDate,
          },
        },
      };
      if (warehouse !== "" && typeof warehouse !== "undefined") {
        filterStock.id_warehouse = warehouse;
      }
      if (role == 2) {
        let find = await WarehouseAdminModel.findAll({
          where: { id_user },
        });
        warehouse = find[0].dataValues.id_warehouse;
        filterStock.id_warehouse = warehouse;
      }
      let productData = await ProductModel.findAndCountAll({
        where: filterProduct,

        limit,
        order: [orderFilter],
        page,
        offset,
        distinct: true,
        col: "id_product",
        include: [
          {
            model: CategoryProductModel,
            where: filterCategory,
            attributes: [],
          },
          {
            model: StockHistoryModel,
            as: "stockprod",
            where: filterStock,
            attributes: [],
          },
        ],
      });

      ///get total item sama total page
      const total_item = productData.count;
      const total_page = Math.ceil(total_item / limit);
      for (let i = 0; i < productData.rows.length; i++) {
        let tempt = {};
        tempt.id_product = productData.rows[i].dataValues.id_product;
        tempt.name = productData.rows[i].dataValues.name;
        id_product = productData.rows[i].dataValues.id_product;

        let filterhistory = {
          date: {
            [sequelize.Op.and]: {
              [sequelize.Op.gte]: startDate,
              [sequelize.Op.lt]: endDate,
            },
          },
          id_product,
        };
        let filterminus = {
          date: {
            [sequelize.Op.and]: {
              [sequelize.Op.gte]: startDate,
              [sequelize.Op.lt]: endDate,
            },
          },
          id_product,
          type: { [sequelize.Op.or]: [2, 4, 5] },
        };
        let filterplus = {
          date: {
            [sequelize.Op.and]: {
              [sequelize.Op.gte]: startDate,
              [sequelize.Op.lt]: endDate,
            },
          },
          id_product,
          type: { [sequelize.Op.or]: [1, 3, 6, 7] },
        };
        if (warehouse !== "" && typeof warehouse !== "undefined") {
          filterhistory.id_warehouse = warehouse;
          filterplus.id_warehouse = warehouse;
          filterminus.id_warehouse = warehouse;
        }
        if (role == 2) {
          let find = await WarehouseAdminModel.findAll({
            where: { id_user },
          });
          let warehouse = find[0].dataValues.id_warehouse;
          filterhistory.id_warehouse = warehouse;
          filterplus.id_warehouse = warehouse;
          filterminus.id_warehouse = warehouse;
        }
        let out = await ProductModel.findAll({
          where: { id_product },
          group: ["id_product"],
          raw: true,
          attributes: [
            "id_product",
            "name",
            [sequelize.fn("sum", sequelize.col("amount")), "jumlah"],
          ],
          include: [
            {
              model: StockHistoryModel,
              as: "stockprod",
              attributes: [],
              where: filterminus,
            },
          ],
        });
        let In = await ProductModel.findAll({
          where: { id_product },
          group: ["id_product"],
          raw: true,
          attributes: [
            "id_product",
            "name",
            [sequelize.fn("sum", sequelize.col("amount")), "jumlah"],
          ],
          include: [
            {
              model: StockHistoryModel,
              as: "stockprod",
              attributes: [],
              where: filterplus,
            },
          ],
        });
        let last = await StockHistoryModel.findAll({
          where: filterhistory,
          limit: 1,
          order: [["date", "desc"]],
        });
        if (last.length > 0) {
          tempt.last = last[0].total;
        } else {
          tempt.last = 0;
        }
        if (out.length > 0) {
          tempt.out = parseInt(out[0].jumlah);
        } else {
          tempt.out = 0;
        }
        if (In.length > 0) {
          tempt.In = parseInt(In[0].jumlah);
        } else {
          tempt.In = 0;
        }
        result.push(tempt);
      }
      return res.status(201).send({
        data: result,
        total_item,
        total_page,
        page,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getProductDetail: async (req, res) => {
    try {
      const response = await ProductModel.findOne({
        where: {
          id_product: req.query.id,
        },
        attributes: [
          "id_product",
          "name",
          "description",
          "weight",
          "price",
          [sequelize.fn("sum", sequelize.col("stocks.stock")), "stock"],
        ],
        include: [
          {
            model: StockModel,
            as: "stocks",
            attributes: [],
          },
        ],
      });

      res.json(response);
    } catch (error) {
      console.log(error);
    }
  },

  editStock: async (req, res) => {
    try {
      let id = req.decript.id_user;
      let role = req.decript.role;

      let { input, id_product, id_warehouse, type, note, date } = req.body;

      if (role == 3) {
        res.status(400).send({
          success: false,
          msg: "Super Admin tidak punya kewenangan untuk melakukan ini",
        });
      } else {
        let check = [];
        if (role == 2) {
          let search = await WarehouseAdminModel.findOne({
            where: { id_user: id },
            raw: true,
          });
          check.push(search);
        }

        if (check[0].id_warehouse == id_warehouse) {
          if (type == "increment") {
            let inputItem = await StockModel.increment(
              { stock: input },
              {
                where: {
                  [Op.and]: [{ id_product }, { id_warehouse }],
                },
              }
            );
            let findLast = await StockHistoryModel.findOne({
              where: {
                [Op.and]: [{ id_product }, { id_warehouse }],
              },
              order: [["date", "DESC"]],
            });
            let hasil = findLast.dataValues.total + input;
            let stockHistory = await StockHistoryModel.create({
              id_warehouse,
              id_product,
              date,
              type: 1,
              amount: input,
              note,
              total: hasil,
            });
            res.status(200).send("done");
          } else if (type == "decrement") {
            let buangItem = await StockModel.decrement(
              { stock: input },
              {
                where: {
                  [Op.and]: [{ id_product }, { id_warehouse }],
                },
              }
            );
            let findLast = await StockHistoryModel.findOne({
              where: {
                [Op.and]: [{ id_product }, { id_warehouse }],
              },
              order: [["date", "DESC"]],
            });
            let hasil = findLast.dataValues.total - input;
            let amount = `-${input}`;
            let stockHistory = await StockHistoryModel.create({
              id_warehouse,
              id_product,
              date,
              type: 1,
              amount,
              note,
              total: hasil,
            });
            res.status(200).send("done");
          }
        } else {
          res.status(400).send({
            success: false,
            msg: "Anda tidak punya kewenangan untuk melakukan ini",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  getWarehouseRequestFrom: async (req, res) => {
    try {
      let id = parseInt(req.query.id);
      let filterWarehouse = {};

      filterWarehouse.id_warehouse = {
        [Op.ne]: [id],
      };

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

  getStockFrom: async (req, res) => {
    try {
      let id_warehouse = parseInt(req.query.warehouse);
      let id_product = parseInt(req.query.product);
      let data = await StockModel.findOne({
        where: { id_warehouse, id_product },
      });

      res.status(200).send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  requestMoveStock: async (req, res) => {
    try {
      let {
        input,
        id_product,
        from_id_warehouse,
        to_id_warehouse,
        date,
        note,
      } = req.body;

      let id = req.decript.id_user;
      let role = req.decript.role;

      if (role == 3) {
        res.status(400).send({
          success: false,
          msg: "Super Admin tidak punya kewenangan untuk melakukan ini",
        });
      } else {
        let check = [];
        if (role == 2) {
          let search = await WarehouseAdminModel.findOne({
            where: { id_user: id },
            raw: true,
          });
          check.push(search);
        }
        if (check[0].id_warehouse == to_id_warehouse) {
          //STOK BARANG DI GUDANG SBLH DI HOLD DULU (stok dan stok histori)
          let holdItem = await StockModel.decrement(
            { stock: input },
            {
              where: {
                [Op.and]: [{ id_product }, { id_warehouse: from_id_warehouse }],
              },
            }
          );
          let findLast = await StockHistoryModel.findOne({
            where: {
              [Op.and]: [{ id_product }, { id_warehouse: from_id_warehouse }],
            },
            order: [["date", "DESC"]],
          });
          let hasil = findLast.dataValues.total - input;
          let amount = `-${input}`;
          let stockHistory = await StockHistoryModel.create({
            id_warehouse: from_id_warehouse,
            id_product,
            date,
            type: 4,
            amount,
            note,
            total: hasil,
          });

          let warehouseMutationRequest = await WarehouseMutationModel.create({
            id_product,
            id_warehouse_sender: from_id_warehouse,
            id_warehouse_receiver: to_id_warehouse,
            date,
            total_item: input,
            status: 2,
            notes: note,
          });

          res.status(200).send("request sent");
        } else {
          res.status(400).send({
            success: false,
            msg: "Anda tidak punya kewenangan untuk mengirim request ini",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  getMutation: async (req, res) => {
    try {
      let warehouseReceive = req.body.warehouseReceive;
      let warehouseSend = req.body.warehouseSend;
      let search = req.body.search;
      let category = req.body.category;
      let urut = req.body.order;
      let status = req.body.status;

      let limit = 5;
      // let page = 0;
      let page = parseInt(req.body.page);
      let result = [];
      let offset = page * limit;

      let filterCategory = {};
      let filterName = {};
      let filterWarehouse = {};

      let order = [["id_mutation"]];

      if (urut == 0) {
        order = [["date", "DESC"]];
      } else if (urut == 1) {
        order = [["date", "ASC"]];
      } else if (urut == 2) {
        order = [["date", "DESC"]];
      }

      if (warehouseReceive !== "" && typeof warehouseReceive !== "undefined") {
        filterWarehouse.id_warehouse_receiver = warehouseReceive;
      }
      if (warehouseSend !== "" && typeof warehouseSend !== "undefined") {
        filterWarehouse.id_warehouse_sender = warehouseSend;
      }
      if (category !== "" && typeof category !== "undefined") {
        filterCategory.id_category = category;
      }

      if (search !== "" && typeof search !== "undefined") {
        filterName.name = {
          [Op.like]: [`%${search}%`],
        };
      }

      if (status !== "" && typeof status !== "undefined") {
        filterWarehouse.status = status;
      }

      let count = await WarehouseMutationModel.findAndCountAll({
        where: filterWarehouse,
        subQuery: false,
        limit,
        page,
        offset,
        order,
        raw: true,
        include: [
          {
            model: ProductModel,
            where: filterName,
            attributes: [],
            include: [
              {
                model: CategoryProductModel,
                where: filterCategory,
                attributes: [],
              },
            ],
          },
        ],
      });
      const total_page = Math.ceil(count.count / limit);

      for (let i = 0; i < count.rows.length; i++) {
        let tempt = {
          Product: {},
          sender: {},
          receiver: {},
          warehouse_mutation_status: {},
        };
        let id = count.rows[i].id_mutation;

        let get = await WarehouseMutationModel.findOne({
          where: { id_mutation: id },
          attributes: [
            "id_mutation",
            "total_item",
            "status",
            "resi",
            "courier",
            "notes",
          ],
          include: [
            {
              model: ProductModel,
              where: filterName,
              attributes: ["name", "product_picture", "id_product"],
            },
            {
              model: WarehouseModel,
              as: "sender",
              attributes: [
                "warehouse_branch_name",
                "detail_address",
                "id_warehouse",
              ],
            },
            {
              model: WarehouseModel,
              as: "receiver",
              attributes: [
                "warehouse_branch_name",
                "detail_address",
                "id_warehouse",
              ],
            },
            {
              model: WarehouseMutationStatusModel,
              attributes: ["description"],
            },
          ],
        });

        tempt.id_mutation = get.dataValues.id_mutation;
        tempt.total_item = get.dataValues.total_item;
        tempt.status = get.dataValues.status;
        tempt.resi = get.dataValues.resi;
        tempt.courier = get.dataValues.courier;
        tempt.notes = get.dataValues.notes;
        tempt.Product.name = get.dataValues.Product.dataValues.name;
        tempt.Product.id_product = get.dataValues.Product.dataValues.id_product;
        tempt.Product.product_picture =
          get.dataValues.Product.dataValues.product_picture;
        tempt.sender.warehouse_branch_name =
          get.dataValues.sender.dataValues.warehouse_branch_name;
        tempt.sender.detail_address =
          get.dataValues.sender.dataValues.detail_address;
        tempt.sender.id_warehouse =
          get.dataValues.sender.dataValues.id_warehouse;
        tempt.receiver.warehouse_branch_name =
          get.dataValues.receiver.dataValues.warehouse_branch_name;
        tempt.receiver.detail_address =
          get.dataValues.receiver.dataValues.detail_address;
        tempt.receiver.id_warehouse =
          get.dataValues.receiver.dataValues.id_warehouse;
        tempt.warehouse_mutation_status.description =
          get.dataValues.warehouse_mutation_status.dataValues.description;

        result.push(tempt);
      }

      res.status(200).send({
        data: result,
        total_page,
        page,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  getWarehouseMutationStatus: async (req, res) => {
    try {
      let getData = await WarehouseMutationStatusModel.findAll().then(
        (response) => {
          return res.status(201).send(response);
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  approveStockMove: async (req, res) => {
    try {
      //ubah status mutation warehouse dr 2 jadi 4
      let id_mutation = req.body.id_mutation;
      let from_id_warehouse = req.body.from_id_warehouse;

      let id = req.decript.id_user;
      let role = req.decript.role;

      if (role == 3) {
        res.status(400).send({
          success: false,
          msg: "Super Admin tidak punya kewenangan untuk melakukan ini",
        });
      } else {
        let check = [];
        if (role == 2) {
          let search = await WarehouseAdminModel.findOne({
            where: { id_user: id },
            raw: true,
          });
          check.push(search);
        }

        if (check[0].id_warehouse == from_id_warehouse) {
          let updateStatus = await WarehouseMutationModel.update(
            { status: 4 },
            {
              where: { id_mutation },
            }
          );
          res.status(200).send("success");
        } else {
          res.status(400).send({
            success: false,
            msg: "Anda tidak punya kewenangan untuk melakukan ini",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  rejectStockMove: async (req, res) => {
    try {
      //ubah status mutation warehouse dr 2 jadi 8
      let { id_mutation, input, id_product, id_warehouse, date } = req.body;

      let id = req.decript.id_user;
      let role = req.decript.role;

      if (role == 3) {
        res.status(400).send({
          success: false,
          msg: "Super Admin tidak punya kewenangan untuk melakukan ini",
        });
      } else {
        let check = [];
        if (role == 2) {
          let search = await WarehouseAdminModel.findOne({
            where: { id_user: id },
            raw: true,
          });
          check.push(search);
        }

        if (check[0].id_warehouse == id_warehouse) {
          let updateStatus = await WarehouseMutationModel.update(
            { status: 8 },
            {
              where: { id_mutation },
            }
          );
          //penambahan stok yang sblmnya on hold kembali ke gudang pengirim(stok dan stok histori)

          let inputItem = await StockModel.increment(
            { stock: input },
            {
              where: {
                [sequelize.Op.and]: [{ id_product }, { id_warehouse }],
              },
            }
          );
          let findLast = await StockHistoryModel.findOne({
            where: {
              [sequelize.Op.and]: [{ id_product }, { id_warehouse }],
            },
            order: [["date", "DESC"]],
          });
          let hasil = findLast.dataValues.total + input;
          let stockHistory = await StockHistoryModel.create({
            id_warehouse,
            id_product,
            date,
            type: 6,
            amount: input,
            note,
            total: hasil,
          });
          res.status(200).send("success");
        } else {
          res.status(400).send({
            success: false,
            msg: "Anda tidak punya kewenangan untuk melakukan ini",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  sendStockMove: async (req, res) => {
    try {
      //ubah status mutation warehouse dr 3 atau 4 jadi 5
      let id_mutation = req.body.id_mutation;
      let resi = req.body.resi;
      let courier = req.body.courier;
      let from_id_warehouse = req.body.from_id_warehouse;

      let id = req.decript.id_user;
      let role = req.decript.role;

      if (role == 3) {
        res.status(400).send({
          success: false,
          msg: "Super Admin tidak punya kewenangan untuk melakukan ini",
        });
      } else {
        let check = [];
        if (role == 2) {
          let search = await WarehouseAdminModel.findOne({
            where: { id_user: id },
            raw: true,
          });
          check.push(search);
        }

        if (check[0].id_warehouse == from_id_warehouse) {
          let updateStatus = await WarehouseMutationModel.update(
            { status: 5, resi, courier },
            {
              where: { id_mutation },
            }
          );

          res.status(200).send("success");
        } else {
          res.status(400).send({
            success: false,
            msg: "Anda tidak punya kewenangan untuk melakukan ini",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  acceptedStockMove: async (req, res) => {
    try {
      //ubah status mutation warehouse dr 5 jadi 6
      let { id_mutation, input, id_product, id_warehouse, date } = req.body;

      let id = req.decript.id_user;
      let role = req.decript.role;

      if (role == 3) {
        res.status(400).send({
          success: false,
          msg: "Super Admin tidak punya kewenangan untuk melakukan ini",
        });
      } else {
        let check = [];

        if (role == 2) {
          let search = await WarehouseAdminModel.findOne({
            where: { id_user: id },
            raw: true,
          });
          check.push(search);
        }

        if (check[0].id_warehouse == id_warehouse) {
          let updateStatus = await WarehouseMutationModel.update(
            { status: 6 },
            {
              where: { id_mutation },
            }
          );
          //penambahan jumlah stok item yang on hold ke dalam stok dan stok history

          let inputItem = await StockModel.increment(
            { stock: input },
            {
              where: {
                [Op.and]: [{ id_product }, { id_warehouse }],
              },
            }
          );
          let findLast = await StockHistoryModel.findOne({
            where: {
              [Op.and]: [{ id_product }, { id_warehouse }],
            },
            order: [["date", "DESC"]],
          });
          let hasil = findLast.dataValues.total + input;
          let stockHistory = await StockHistoryModel.create({
            id_warehouse,
            id_product,
            date,
            type: 3,
            amount: input,
            note,
            total: hasil,
          });

          res.status(200).send("success");
        } else {
          res.status(400).send({
            success: false,
            msg: "Anda tidak punya kewenangan untuk melakukan ini",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
