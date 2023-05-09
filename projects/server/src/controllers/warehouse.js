const {
  WarehouseModel,
  PostalCodeModel,
  ProductModel,
  StockModel,
  StockHistoryModel,
} = require("../model");
const Axios = require("axios");
const { Op } = require("sequelize");

module.exports = {
  //UNTUK PAGE ALL DATA WAREHOUSE
  getDataWarehouse: async (req, res) => {
    try {
      // KALO SUDAH MASUK SINI SUDAH SUPER ADMIN
      let search = req.body.search;
      let urut = req.body.order;
      let limit = parseInt(req.body.limit);
      let page = req.body.page;
      let offset = page * limit;
      //
      let filterName = {};
      //
      let order = [["id_warehouse"]];

      if (urut == 0) {
        order = [["id_warehouse"]];
      } else if (urut == 1) {
        order = [["warehouse_branch_name", "ASC"]];
      } else if (urut == 2) {
        order = [["warehouse_branch_name", "DESC"]];
      }
      //
      if (search !== "" && typeof search !== "undefined") {
        filterName.warehouse_branch_name = {
          [Op.like]: [`%${search}%`],
        };
      }
      //
      let data = await WarehouseModel.findAndCountAll({
        where: filterName,
        limit,
        page,
        offset,
        order,
        raw: true,
      });

      const total_page = Math.ceil(data.count / limit);

      res.status(200).send({ data: data.rows, total_page, page });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  //PAGE EDIT
  getIdWarehouse: async (req, res) => {
    try {
      let id_warehouse = req.query.id_warehouse;
      let data = await WarehouseModel.findAll({
        where: { id_warehouse },
      });

      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  getPostalWarehouse: async (req, res) => {
    try {
      let postal_code = req.query.postal;
      let data = await PostalCodeModel.findAll({
        where: { postal_code },
      });
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  addWarehouse: async (req, res) => {
    try {
      let {
        warehouse_branch_name,
        phone_number,
        city,
        province,
        postal_code,
        detail_address,
        key_province,
        key_city,
        date,
      } = req.body;

      let data = await WarehouseModel.findAll({
        where: {
          [Op.or]: [{ warehouse_branch_name }],
        },
      });
      if (data.length > 0) {
        res.status(400).send({
          success: false,
          msg: "Name already registered",
        });
      } else {
        let checkPostalCode = await PostalCodeModel.findAll({
          where: { postal_code },
        });
        if (checkPostalCode.length == 0) {
          let addpostalcode = await PostalCodeModel.create({
            city,
            province,
            postal_code,
            key_city,
            key_province,
          });
        }

        let newWarehouse = await WarehouseModel.create({
          warehouse_branch_name,
          postal_code,
          detail_address,
          phone_number,
        });

        let getProduct = await ProductModel.findAll();
        let product = getProduct;

        product.map((val, idx) => {
          let newStock = StockModel.create({
            id_warehouse: newWarehouse.id_warehouse,
            id_product: val.dataValues.id_product,
            stock: 0,
          });

          let newStockHistory = StockHistoryModel.create({
            id_warehouse: newWarehouse.id_warehouse,
            id_product: val.dataValues.id_product,
            date,
            type: 8,
            amount: 0,
            total: 0,
          });
        });

        let encoded_city = city.replace(" ", "+");
        let encoded_province = province.replace(" ", "+");

        let coordinate = await Axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encoded_city},+${encoded_province}&key=${process.env.OPENCAGE_API_KEY}&pretty=1&no_annotations=1`
        ).then((response) => {
          let datalat = WarehouseModel.update(
            { coordinate_lat: response.data.results[0].geometry.lat },
            {
              where: {
                [Op.and]: [
                  { warehouse_branch_name },
                  { postal_code },
                  { detail_address },
                ],
              },
            }
          );
          let datalong = WarehouseModel.update(
            { coordinate_long: response.data.results[0].geometry.lng },
            {
              where: {
                [Op.and]: [
                  { warehouse_branch_name },
                  { postal_code },
                  { detail_address },
                ],
              },
            }
          );
        });
        return res.status(200).send("done");
      }
    } catch (error) {
      console.log(error);
    }
  },
  editWarehouse: async (req, res) => {
    try {
      let {
        id_warehouse,
        warehouse_branch_name,
        phone_number,
        city,
        province,
        postal_code,
        detail_address,
        key_province,
        key_city,
      } = req.body;
      //
      let data = await WarehouseModel.findAll({
        where: {
          [Op.and]: [
            { warehouse_branch_name, id_warehouse: { [Op.ne]: id_warehouse } },
          ],
        },
      });
      if (data.length > 1) {
        res.status(400).send({
          success: false,
          msg: "Name already registered",
        });
      } else {
        let checkPostalCode = await PostalCodeModel.findAll({
          where: { postal_code },
        });
        if (checkPostalCode.length == 0) {
          let addpostalcode = await PostalCodeModel.create({
            city,
            province,
            postal_code,
            key_city,
            key_province,
          });
        }

        let editWarehouse = await WarehouseModel.update(
          {
            warehouse_branch_name,
            postal_code,
            detail_address,
            phone_number,
          },
          { where: { id_warehouse } }
        );
        // bikin encoded city sm province
        let encoded_city = city.replace(" ", "+");
        let encoded_province = province.replace(" ", "+");

        let coordinate = await Axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encoded_city},+${encoded_province}&key=${process.env.OPENCAGE_API_KEY}&pretty=1&no_annotations=1`
        ).then((response) => {
          let datalat = WarehouseModel.update(
            { coordinate_lat: response.data.results[0].geometry.lat },
            {
              where: {
                [Op.and]: [
                  { warehouse_branch_name },
                  { postal_code },
                  { detail_address },
                ],
              },
            }
          );
          let datalong = WarehouseModel.update(
            { coordinate_long: response.data.results[0].geometry.lng },
            {
              where: {
                [Op.and]: [
                  { warehouse_branch_name },
                  { postal_code },
                  { detail_address },
                ],
              },
            }
          );
        });
        return res.status(200).send("done");
      }
    } catch (error) {
      console.log(error);
    }
  },
  deleteWarehouse: async (req, res) => {
    try {
      let { id_warehouse } = req.body;

      let deleteWarehouse = await WarehouseModel.update(
        {
          status: 3,
        },
        { where: { id_warehouse } }
      );
      return res.status(200).send("data deleted");
    } catch (error) {
      console.log(error);
    }
  },
};
