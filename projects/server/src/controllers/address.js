const AddressModel = require("../model/address");
const PostalCodeModel = require("../model/postal_code");
const sequelize = require("sequelize");
const Axios = require("axios");

module.exports = {
  getAddress: async (req, res) => {
    try {
      let data = await AddressModel.findAll({
        where: { 
          id_user: req.decript.id_user,
          isdeleted: 0 
        },
        include: [
          {
            model: PostalCodeModel,
            as: "lala",
          },
        ],
        order: [["priority", "DESC"]],
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

  addAddress: async (req, res) => {
    try {
      let {
        city,
        province,
        postal_code,
        detail_address,
        receiver,
        phone_number,
        key_province,
        key_city,
        encoded_province,
        priority,
      } = req.body;
      let id_user = req.decript.id_user;
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

      let updateData = {
        postal_code,
        id_user,
        detail_address,
        receiver,
        phone_number,
        priority: priority ? 1 : 0, // set priority to 1 if checkbox is checked, otherwise set to 0
      };

      if (priority) {
        // Set the priority of all other addresses for the same user to 0
        await AddressModel.update(
          { priority: 0 },
          { where: { id_user, priority: 1 } }
        );
      }

      let start = await AddressModel.create(updateData);

      let coordinate = await Axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${city},+${encoded_province}&key=${process.env.OPENCAGE_API_KEY}&pretty=1&no_annotations=1`
      ).then((response) => {
        let updatelat = AddressModel.update(
          { coordinate_lat: response.data.results[0].geometry.lat },
          {
            where: {
              [sequelize.Op.and]: [
                { id_user },
                { postal_code },
                { detail_address },
                { receiver },
                { phone_number },
              ],
            },
          }
        );
        let updatelong = AddressModel.update(
          { coordinate_long: response.data.results[0].geometry.lng },
          {
            where: {
              [sequelize.Op.and]: [
                { id_user },
                { postal_code },
                { detail_address },
                { receiver },
                { phone_number },
              ],
            },
          }
        );
      });

      return res.status(200).send("Added Address Successfully");
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    }
  },

  deleteAddress: async (req, res) => {
    try {
      const { id_user } = req.decript;
      if (!id_user) {
        return res
          .status(400)
          .json({ message: "Missing required parameter: id_user" });
      }
      const { id_address } = req.body;
      const address = await AddressModel.findOne({
        where: { id_user, id_address },
      });
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      // Update the isdeleted field to 1 (true)
      await AddressModel.update(
        { isdeleted: 1 },
        { where: { id_user, id_address } }
      );
      res.status(200).json({ message: "Address soft deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  
  updateAddress: async (req, res) => {
    try {
      const { id_user } = req.decript;
      if (!id_user) {
        return res
          .status(400)
          .json({ message: "Missing required parameter: id_user" });
      }
      const {
        id_address,
        city,
        province,
        postal_code,
        detail_address,
        key_province,
        key_city,
        encoded_province,
        receiver,
        phone_number,
        priority,
      } = req.body;
      const address = await AddressModel.findOne({
        where: { id_user, id_address },
      });
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }

      const updateData = {};

      if (postal_code) {
        if (postal_code !== address.postal_code) {
          const checkPostalCode = await PostalCodeModel.findAll({
            where: { postal_code },
          });
          if (checkPostalCode.length === 0) {
            await PostalCodeModel.create({
              city,
              province,
              postal_code,
              key_city,
              key_province,
            });
          }
        }
        updateData.postal_code = postal_code;
      }

      if (detail_address) {
        updateData.detail_address = detail_address;
      }

      if (city && encoded_province) {
        const coordinate = await Axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${city},+${encoded_province}&key=${process.env.OPENCAGE_API_KEY}&pretty=1&no_annotations=1`
        );
        updateData.coordinate_lat = coordinate.data.results[0].geometry.lat;
        updateData.coordinate_long = coordinate.data.results[0].geometry.lng;
      }

      if (receiver) {
        updateData.receiver = receiver;
      }

      if (phone_number) {
        updateData.phone_number = phone_number;
      }

      if (priority === 1) {
        // Set the priority to 1 (default address) and set the priority of all other addresses for the same user to 0
        await AddressModel.update(
          { priority: 0 },
          { where: { id_user, priority: 1 } }
        );
        updateData.priority = 1;
      } else {
        updateData.priority = 0;
      }

      await AddressModel.update(updateData, { where: { id_user, id_address } });
      res.status(200).json({ message: "Address updated" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  changeDefaultAddress: async (req, res) => {
    try {
      const { id_user } = req.decript;
      if (!id_user) {
        return res
          .status(400)
          .json({ message: "Missing required parameter: id_user" });
      }
      const { id_address } = req.body;
      const address = await AddressModel.findOne({
        where: { id_user, id_address },
      });
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      await AddressModel.update(
        { priority: 0 },
        { where: { id_user, priority: 1 } }
      );
      await AddressModel.update(
        { priority: 1 },
        { where: { id_user, id_address } }
      );
      res.status(200).json({ message: "Default address updated" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
