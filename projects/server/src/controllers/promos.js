const PromosModel = require("../model/promos");
const { Op } = require("sequelize");

module.exports = {
  addPromo: async (req, res) => {
    try {
      let {
        promo_code,
        description,
        max_count,
        promo_picture,
        expire_date,
        limitation,
      } = req.body;

      if (req.file) {
        promo_picture = req.file.filename;
      }

      let check = await PromosModel.findAll({
        where: {
          [Op.or]: [{ promo_code }],
        },
      });

      if (check.length > 0) {
        res.status(400).send({
          success: false,
          msg: "Promo already registered",
        });
      } else {
        const input = await PromosModel.create({
          promo_code,
          description,
          max_count,
          promo_picture,
          expire_date,
          limitation,
          count: 0,
          status: 1,
        });

        res.status(200).send({
          success: true,
          msg: "Add Promo Success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  getPromo: async (req, res) => {
    try {
      let getData = await PromosModel.findAll({
        where: { status: 1 },
        order: [["expire_date", "DESC"]],
        limit: 3,
        page: 0,
        offset: 0,
        raw: true,
      });
      return res.status(201).send({ data: getData });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  getPromoList: async (req, res) => {
    try {
      // KALO SUDAH MASUK SINI SUDAH SUPER ADMIN
      let search = req.body.search;
      let urut = req.body.order;
      let stat = req.body.status;
      let limit = parseInt(req.body.limit);
      let page = req.body.page;
      let offset = page * limit;
      //
      let filterName = {};
      //
      let order = [["id_promo"]];

      if (urut == 0) {
        order = [["id_promo"]];
      } else if (urut == 1) {
        order = [["promo_code", "ASC"]];
      } else if (urut == 2) {
        order = [["promo_code", "DESC"]];
      } else if (urut == 3) {
        order = [["expire_date", "ASC"]];
      } else if (urut == 4) {
        order = [["expire_date", "DESC"]];
      }
      //
      if (search !== "" && typeof search !== "undefined") {
        filterName.promo_code = {
          [Op.like]: [`%${search}%`],
        };
      }

      if (stat !== "" && typeof stat !== "undefined") {
        filterName.status = stat;
      }
      //
      let data = await PromosModel.findAndCountAll({
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
      return res.status(500).send(error);
    }
  },
};
