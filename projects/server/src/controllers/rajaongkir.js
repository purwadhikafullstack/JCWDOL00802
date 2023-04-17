const Axios = require("axios");

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
    let { origin, weight, destination, courier } = req.body;
    let result = await Axios.post(
      "https://api.rajaongkir.com/starter/cost",
      { origin, destination, weight, courier },
      { headers: { key: `${process.env.RAJAONGKIR_API_KEY}` } }
    );
    let cost = result.data.rajaongkir;

    res.status(200).send(cost);
  },
};
