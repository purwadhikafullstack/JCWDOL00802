const { hashPassword } = require("../config/encript");
const UserModel = require("../model/user");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("sequelize");
const { cetakToken } = require("../config/encript");
const jwt = require("jsonwebtoken");
const REACT_URL = "http://localhost:3000";
const { transporter } = require("../config/nodemailer");

module.exports = {
  getDataUser: async (req, res) => {
    try {
      let data = await UserModel.findAll();
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  regis: async (req, res) => {
    try {
      let { email } = req.body;
      let data = await UserModel.findAll({
        where: {
          [Op.or]: [{ email }],
        },
      });
      if (data.length > 0) {
        res.status(400).send({
          success: false,
          msg: "Email already registered",
        });
      } else {
        let results = await UserModel.create({
          email,
        });

        //kirim email

        let tokenEmail = cetakToken({ email });
        //perlu tambahin id tp belom utk cetak token
        transporter.sendMail({
          from: "ClickNCollect",
          to: email,
          subject: "Email verification and password input",
          html: `<div>
          //   <h3>Click this link to verify your email and input password</h3>
          //   <a href="${REACT_URL}/newUser?t=${tokenEmail}">Verify now</a>
          //   </div>`,
        });

        res.status(200).send({
          success: true,
          msg: "Register Success",
        });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },

  verify: async (req, res) => {
    try {
      let email = req.decript.email;
      let { password } = req.body;
      //patch disini
      let newUser = await UserModel.update(
        { password: hashPassword(password), status: 2 },
        {
          where: { email },
        }
      );

      res.status(200).send({
        success: true,
        msg: "Verification Success",
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  login: async (req, res) => {
    try {
      let { email, pass } = req.body;
      let get = await UserModel.findAll({
        where: { email },
      });
      let checkPass = bcrypt.compareSync(pass, get[0].dataValues.password);
      if (get.length == 0) {
        res.status(401).send({
          success: false,
          msg: "Account not found",
        });
      } else {
        if (checkPass) {
          // let results = await UserModel.update(
          //   {
          //     status: 4,
          //   },
          //   { where: { id: get[0].dataValues.id } }
          // );
          delete get[0].dataValues.password;
          let token = cetakToken({ ...get[0].dataValues });
          res.status(200).send({ ...get[0].dataValues, token }); //,token
        } else {
          if (get[0].dataValues.status == 4) {
            let results = await UserModel.update(
              {
                status: 5,
              },
              { where: { id: get[0].dataValues.id } }
            );
            res.status(400).send({
              success: false,
              msg: "Your Account is SUSPENDED",
            });
          } else {
            // let results = await UserModel.update(
            //   {
            //     failed_counter: get[0].dataValues.failed_counter + 1,
            //   },
            //   { where: { id: get[0].dataValues.id } }
            // );
            res.status(400).send({
              success: false,
              msg: "Your password is wrong",
              // failed_login: get[0].dataValues.failed_counter + 1,
            });
          }
        }
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  keepLogin: async (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    try {
      let get = await UserModel.findAll({
        where: { email: req.decript.email },
      });
      res.status(200).send({ ...get[0].dataValues, token });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  requestReset: async (req, res) => {
    try {
      let email = req.body.email;
      //patch disini
      let resetUser = await UserModel.update(
        //status diganti jadi req. reset pass supaya gabisa request reset lagi
        { status: 6 },
        {
          where: { email },
        }
      );
      //kirim email

      let tokenEmail = cetakToken({ email });
      //perlu tambahin id tp belom utk cetak token
      transporter.sendMail({
        from: "ClickNCollect",
        to: email,
        subject: "Reset Password Request",
        html: `<div>
          //   <h3>Click this link to reset your password</h3>
          //   <a href="${REACT_URL}/resetPassword?t=${tokenEmail}">Reset my password</a>
          //   </div>`,
      });

      res.status(200).send({
        success: true,
        msg: "Reset password Success",
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  resetPassword: async (req, res) => {
    try {
      let email = req.decript.email;
      let { password } = req.body;
      //patch disini
      let newUser = await UserModel.update(
        { password: hashPassword(password), status: 2 },
        {
          where: { email },
        }
      );

      res.status(200).send({
        success: true,
        msg: "Reset Password Success",
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
