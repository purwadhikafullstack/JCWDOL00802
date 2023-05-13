const sequelize = require("sequelize");
const WishlistModel = require("../model/Wishlist");
const CartModel = require("../model/Cart");
const ProductModel = require("../model/Product");
const StockModel = require("../model/stock");

module.exports = {
  getWishlist: async (req, res) => {
    try {
      let id_user = req.decript.id_user;
      let data = await WishlistModel.findAll({
        where: { id_user },
        include: [
          {
            model: ProductModel,
          },
        ],
      });
      res.status(200).send({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error,
      });
    }
  },
  addWishlist: async (req, res) => {
    try {
      let id_user = req.decript.id_user;
      let id_product = req.query.id;

      let checker = await WishlistModel.findOne({
        where: { id_user, id_product },
      });

      if (checker) {
        res.status(500).send({
          success: false,
          message: "sudah ada di wishlist",
        });
      } else {
        let create = await WishlistModel.create({ id_product, id_user });
        res.status(200).send({
          success: true,
          message: "berhasil ditambahkan ke wishlist",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: error,
      });
    }
  },
  checkerWishlist: async (req, res) => {
    try {
      let id_user = req.decript.id_user;
      let id_product = req.query.id;

      let checker = await WishlistModel.findOne({
        where: { id_user, id_product },
      });
      if (checker) {
        res.status(200).send({
          isWishlisted: true,
        });
      } else {
        res.status(200).send({
          isWishlisted: false,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: error,
      });
    }
  },
  moveToWishlist: async (req, res) => {
    try {
      let id_user = req.decript.id_user;
      let id_product = req.query.id;

      let checker = await WishlistModel.findOne({
        where: { id_user, id_product },
      });

      if (checker) {
        res.status(500).send({
          success: false,
          message: "sudah ada di wishlist",
        });
      } else {
        let create = await WishlistModel.create({ id_product, id_user });
        let destroyCart = await CartModel.destroy({
          where: { id_user, id_product },
        });
        res.status(200).send({
          success: true,
          message: "berhasil dipindahkan ke wishlist",
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error,
      });
    }
  },
  moveToCart: async (req, res) => {
    try {
      let id_user = req.decript.id_user;
      let id_wishlist = req.query.id;
      let finderWish = await WishlistModel.findOne({
        where: { id_wishlist },
        raw: true,
      });
      let id_product = finderWish.id_product;
      let checker = await CartModel.findOne({ where: { id_product, id_user } });
      if (checker) {
        let id_cart = checker.id_cart;
        let getStock = await ProductModel.findOne({
          where: {
            id_product,
          },
          attributes: [
            "id_product",
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
        let totalNext = checker.total_item + 1;

        let totalStock = parseInt(getStock.dataValues.stock);

        if (totalNext <= totalStock) {
          let update = await CartModel.increment(
            { total_item: 1 },
            {
              where: { id_cart },
            }
          );
          res.status(200).send({
            success: true,
            message: "berhasil menambahkan jumlah dikeranjang",
          });
        } else {
          res.status(500).send({
            success: false,
            message: "sudah Maksimal di keranjang",
          });
        }
      } else {
        let create = await CartModel.create({
          id_user,
          id_product,
          total_item: 1,
        });
        res.status(200).send({
          success: true,
          message: "berhasil ditambahkan ke keranjang",
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error,
      });
    }
  },
  removeWishist: async (req, res) => {
    try {
      let id_product = req.query.id;
      let id_user = req.decript.id_user;

      let remove = await WishlistModel.destroy({
        where: { id_user, id_product },
      });
      res.status(200).send({
        success: true,
        message: "berhasil menghapus",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error,
      });
    }
  },
};
