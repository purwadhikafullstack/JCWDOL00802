const PromosModel = require("../model/promos");
const { Op } = require("sequelize");
const fs = require("fs");

const REACT_URL = "https://jcwdol00802.purwadhikabootcamp.com";
const { transporter } = require("../config/nodemailer");
const { UserModel } = require("../model");

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
        category,
        count_user,
        email,
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
          count_user,
          category,
        });

        if (email) {
          const subbers = await UserModel.findAll({
            where: { subs: 1 },
          });
          subbers.map((val, idx) => {
            transporter.sendMail({
              from: "ClickNCollect",
              to: val.dataValues.email,
              subject: "PROMO REMINDER",
              html: `<div>
            //   <h6>NIKMATI PROMO SAAT BERBELANJA DI CLICK N COLLECT</h6>
            //   <h3>${promo_code}</h3>
            //   <h6>${description}</h6>
            //   <a href="${REACT_URL}">Belanja Sekarang</a>
            //   </div>`,
            });
          });
        }
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
  getIdPromo: async (req, res) => {
    try {
      let id_promo = req.query.id_promo;
      let data = await PromosModel.findOne({
        where: { id_promo },
      });
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  editPromo: async (req, res) => {
    try {
      let { promo_code, description, promo_picture, expire_date } = req.body;
      let id_promo = parseInt(req.body.id_promo);
      let max_count = parseInt(req.body.max_count);
      let limitation = parseInt(req.body.limitation);
      let status = parseInt(req.body.status);
      let category = parseInt(req.body.category);
      let count_user = parseInt(req.body.count_user);

      let filterCheck = {};
      filterCheck.promo_code = promo_code;
      filterCheck.id_promo = { [Op.ne]: [id_promo] };

      //
      let data = await PromosModel.findAll({
        where: filterCheck,
      });
      if (data.length > 1) {
        res.status(400).send({
          success: false,
          msg: "code already registered",
        });
      } else {
        if (req.file) {
          let oldpic = await PromosModel.findOne({ where: { id_promo } });
          if (oldpic.dataValues.promo_picture) {
            const filePath =
              "./src/public/img/promo/" + oldpic.dataValues.promo_picture;
            fs.exists(filePath, function (exists) {
              if (exists) {
                fs.unlinkSync(filePath);
              } else {
                console.log("File not found.");
              }
            });
          }
          promo_picture = req.file.filename;
        }
        let editPromo = await PromosModel.update(
          {
            promo_code,
            description,
            max_count,
            promo_picture,
            expire_date,
            limitation,
            status,
            category,
            count_user,
          },
          { where: { id_promo } }
        );
        return res.status(200).send("done");
      }
    } catch (error) {
      console.log(error);
    }
  },
  getPromoLanding: async (req, res) => {
    try {
      let page = parseInt(req.query.page) - 1;
      let getData = await PromosModel.findAll({
        where: { status: 1 },
        order: [["expire_date", "DESC"]],
        limit: 1,
        page,
        offset: page,
        raw: true,
      });

      let data = await PromosModel.findAndCountAll({
        where: { status: 1 },
        limit: 1,
        page,
        offset: page,
        order: [["expire_date", "DESC"]],
        raw: true,
      });
      const total_page = Math.ceil(data.count);
      return res.status(201).send({ data: getData, total_page });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  emailPromo: async (req, res) => {
    try {
      let { id_promo } = req.body;

      let get = await PromosModel.findOne({
        where: {
          id_promo,
        },
      });
      const subbers = await UserModel.findAll({
        where: { subs: 1 },
      });
      subbers.map((val, idx) => {
        transporter.sendMail({
          from: "ClickNCollect",
          to: val.dataValues.email,
          subject: "PROMO REMINDER",
          html: `<div>
            //   <h6>NIKMATI PROMO SAAT BERBELANJA DI CLICK N COLLECT</h6>
            //   <h3>${get.dataValues.promo_code}</h3>
            //   <h6>${get.dataValues.description}</h6>
            //   <a href="${REACT_URL}">Belanja Sekarang</a>
            //   </div>`,
        });
      });
      res.status(200).send({
        success: true,
        msg: "Send Mail Promo Success",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
