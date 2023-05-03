const Axios = require("axios");
const AddressModel = require("../model/address");
const { PostalCodeModel, WarehouseModel } = require("../model");

module.exports = {
  getProvince: async (req, res) => {
    let result = await Axios.get(
      "https://api.rajaongkir.com/starter/province",
      { headers: { key: `${process.env.RAJAONGKIR_API_KEY}` } }
    );

    let province = result.data.rajaongkir.results;
    res.status(200).send(province);
  },

  getCity: async (req, res) => {
    let province = req.query.province;
    let result = await Axios.get(
      `https://api.rajaongkir.com/starter/city?province=${province}`,
      {
        headers: { key: `${process.env.RAJAONGKIR_API_KEY}` },
      }
    );
    let city = result.data.rajaongkir.results;
    res.status(200).send(city);
  },

  getShipment: async (req, res) => {
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

    try {
      let { weight, courier } = req.body;
      let id_user = req.decript.id_user;
      let AddressGet = await AddressModel.findOne({
        where: { id_user, priority: 1 },
        include: [
          {
            model: PostalCodeModel,
            as: "lala",
          },
        ],
      });
      let destination = AddressGet.lala.key_city;
      let findWarehouse = await WarehouseModel.findAll({});

      let closestWarehouse = closestLocation(AddressGet, findWarehouse);
      let postal_code = closestWarehouse.postal_code;
      let postalFind = await PostalCodeModel.findOne({
        raw: true,
        where: { postal_code },
      });

      let origin = postalFind.key_city;

      let result = await Axios.post(
        "https://api.rajaongkir.com/starter/cost",
        { origin, destination, weight, courier },
        { headers: { key: `${process.env.RAJAONGKIR_API_KEY}` } }
      );
      let cost = result.data.rajaongkir;
      res.status(200).send(cost);
    } catch (error) {
      console.log(error);
    }
  },

  getCityAddress: async (req, res) => {
    let result = await Axios.get("https://api.rajaongkir.com/starter/city", {
      headers: { key: `${process.env.RAJAONGKIR_API_KEY}` },
    });
    let city = result.data.rajaongkir.results;
    res.status(200).send(city);
  },
};
