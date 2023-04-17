const AddressModel = require("../model/address");
const PostalCodeModel = require("../model/postal_code");
const sequelize = require("sequelize");
const Axios = require("axios");

module.exports = {
  getAddress: async (req, res) => {
    try {
      let data = await AddressModel.findAll({
        where: { id_user: req.decript.id_user },
        include: [
          {
            model: PostalCodeModel,
            as: "lala",
          },
        ],
      }).then((response) => {
        return res.status(200).send(response);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getAddressDetail: async (req, res) => {
    try {
      let data = await AddressModel.findAll({
        where: {
          [sequelize.Op.and]: [
            { id_user: req.decript.id_user },
            { priority: 1 },
          ],
        },
      });

      let postal_code = data[0].dataValues.postal_code;
      let detail = await PostalCodeModel.findAll({
        where: { postal_code },
      });
      let result = [];
      result.push({ ...data[0].dataValues, ...detail[0].dataValues });

      res.json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  changeSelectedAddress: async (req, res) => {
    try {
      let { id_address } = req.body;
      let id_user = req.decript.id_user;
      let begin = await AddressModel.update(
        { priority: 0 },
        { where: { id_user } }
      );
      let result = await AddressModel.update(
        { priority: 1 },
        {
          where: {
            [sequelize.Op.and]: [{ id_address }, { id_user }],
          },
        }
      );
      return res.status(200).send("oke");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
