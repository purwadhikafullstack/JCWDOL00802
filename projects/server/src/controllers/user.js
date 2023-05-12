const { hashPassword } = require("../config/encript");
const UserModel = require("../model/user");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { cetakToken } = require("../config/encript");
const REACT_URL = "https://jcwdol00802.purwadhikabootcamp.com";
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
        where: { email },
      });
      if (data.length > 0) {
        if (data[0].dataValues.status == 3) {
          //kirim email
          let tokenEmail = cetakToken({ email });
          transporter.sendMail({
            from: "ClickNCollect",
            to: email,
            subject: "Account Reactivation",
            html: `<div>
          //   <h3>Click this link to reactivate your account and reset your password</h3>
          //   <a href="${REACT_URL}/resetPassword?t=${tokenEmail}">Reset my password</a>
          //   </div>`,
          });
          res.status(400).send({
            success: false,
            msg: "Check your email for re-activation",
          });
        } else {
          res.status(400).send({
            success: false,
            msg: "Email already registered",
          });
        }
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
      let { password, subs } = req.body;
      //patch disini
      let newUser = await UserModel.update(
        { password: hashPassword(password), status: 2, subs, role: 1 },
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
        if (get[0].dataValues.status == 4) {
          res.status(400).send({
            success: false,
            msg: "Your Account is SUSPENDED. Please make a request to reset your password.",
          });
        } else if (get[0].dataValues.status == 3) {
          //kirim email
          let tokenEmail = cetakToken({ email });
          transporter.sendMail({
            from: "ClickNCollect",
            to: email,
            subject: "Account Reactivation",
            html: `<div>
          //   <h3>Click this link to reactivate your account and reset your password</h3>
          //   <a href="${REACT_URL}/resetPassword?t=${tokenEmail}">Reset my password</a>
          //   </div>`,
          });
          res.status(400).send({
            success: false,
            msg: "Check your email for re-activation",
          });
        } else if (checkPass) {
          let results = await UserModel.update(
            {
              reset_request: 0,
              count: 0,
            },
            { where: { id_user: get[0].dataValues.id_user } }
          );
          delete get[0].dataValues.password;
          let token = cetakToken({ ...get[0].dataValues });
          res.status(200).send({ ...get[0].dataValues, token });
        } else {
          if (get[0].dataValues.count == 3) {
            let results = await UserModel.update(
              {
                status: 4,
              },
              { where: { id_user: get[0].dataValues.id_user } }
            );
            res.status(400).send({
              success: false,
              msg: "Your Account is SUSPENDED. Please make a request to reset your password.",
            });
          } else {
            let results = await UserModel.update(
              {
                count: get[0].dataValues.count + 1,
              },
              { where: { id_user: get[0].dataValues.id_user } }
            );
            res.status(400).send({
              success: false,
              msg: "Your password is wrong",
              failed_login: get[0].dataValues.count + 1,
            });
          }
        }
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  keepLogin: async (req, res) => {
    let token = req.token;
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
      let check = await UserModel.findAll({
        where: { email },
      });
      if (check.length == 0) {
        res.status(401).send({
          success: false,
          msg: "Account not found",
        });
      } else {
        if (check[0].dataValues.reset_request == 1) {
          res.status(401).send({
            success: false,
            msg: "Reset password already requested",
          });
        } else {
          let resetUser = await UserModel.update(
            { reset_request: 1 },
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
            msg: "Reset password Requested",
          });
        }
      }
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
        {
          password: hashPassword(password),
          status: 2,
          reset_request: 0,
          count: 0,
        },
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

  editProfile: async (req, res) => {
    try {
      const { username, email, phone_number, full_name } = req.body;
      const { id_user } = req.decript;
      const user = await UserModel.findOne({
        where: { id_user },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updateData = {};
      if (username !== undefined && username !== "") {
        updateData.username = username;
      }
      if (email !== undefined && email !== "") {
        updateData.email = email;
      }
      if (phone_number !== undefined && phone_number !== "") {
        updateData.phone_number = phone_number;
      }
      if (full_name !== undefined && full_name !== "") {
        updateData.full_name = full_name;
      }
      if (req.file) {
        updateData.profile_picture = req.file.filename;
      }

      const updateProfile = await UserModel.update(updateData, {
        where: { id_user },
      });
      res.status(201).json({
        message: "Success",
        data: updateProfile,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  getProfile: async (req, res) => {
    try {
      const response = await UserModel.findOne({
        where: {
          id_user: req.decript.id_user,
        },
      });

      let profilePicture = response.profile_picture;

      if (!profilePicture) {
        profilePicture = "default.png";
      } else {
        profilePicture = `${profilePicture}`;
      }

      const picPath = `https://jcwdol00802.purwadhikabootcamp.com/img/profile/${profilePicture}`;
      response.profile_picture = picPath;

      res.json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  getUserList: async (req, res) => {
    try {
      let search = req.body.search;
      let urut = req.body.order;
      let limit = parseInt(req.body.limit);
      let page = req.body.page;
      let offset = page * limit;

      let filterName = {};

      let order = [["id_user"]];

      if (urut == 0) {
        order = [["id_user"]];
      } else if (urut == 1) {
        order = [["full_name", "ASC"]];
      } else if (urut == 2) {
        order = [["full_name", "DESC"]];
      }

      if (search !== "" && typeof search !== "undefined") {
        filterName.full_name = {
          [Op.like]: `%${search}%`,
        };
      }

      filterName.role = {
        [Op.ne]: 3,
      };

      // Add condition for status
      filterName.status = {
        [Op.or]: [1, 2],
      };

      let data = await UserModel.findAndCountAll({
        where: filterName,
        limit,
        offset,
        order,
        raw: true,
      });

      // Format profile_picture for each user
      const formattedUsers = data.rows.map((user) => {
        let profilePicture = user.profile_picture;

        if (!profilePicture) {
          profilePicture = "default.png";
        } else {
          profilePicture = `${profilePicture}`;
        }

        const picPath = `${protocol}:${process.env.PORT}/img/profile/${profilePicture}`;
        user.profile_picture = picPath;

        return user;
      });

      const total_page = Math.ceil(data.count / limit);

      res.status(200).send({ data: formattedUsers, total_page, page });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const adminId = req.decript.id_user;
      const userIdToDelete = req.body.id_user;
      if (adminId === userIdToDelete) {
        return res
          .status(400)
          .json({ message: "You cannot delete your own account" });
      }
      const adminUser = await UserModel.findOne({
        where: { id_user: adminId },
      });
      if (adminUser.role !== 3) {
        return res.status(403).json({
          message: "You do not have permission to perform this action",
        });
      }
      const userToDelete = await UserModel.findOne({
        where: { id_user: userIdToDelete },
      });
      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }
      await userToDelete.update({ status: 3 });
      res
        .status(200)
        .json({ message: "User deleted successfully", data: userToDelete });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const id_user = req.decript.id_user;
      const superAdmin = await UserModel.findOne({ where: { id_user } });

      if (!superAdmin || superAdmin.role !== 3) {
        return res.status(403).json({
          message: "You do not have permission to perform this action",
        });
      }

      const {
        target_id_user,
        username,
        phone_number,
        full_name,
        role,
        password,
        email,
      } = req.body;
      const user = await UserModel.findOne({
        where: { id_user: target_id_user },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updateData = {};
      if (username !== undefined && username !== "") {
        updateData.username = username;
      }
      if (phone_number !== undefined && phone_number !== "") {
        updateData.phone_number = phone_number;
      }
      if (full_name !== undefined && full_name !== "") {
        updateData.full_name = full_name;
      }
      if (role !== undefined) {
        const parsedRole = parseInt(role, 10);
        if (parsedRole === 1 || parsedRole === 2) {
          updateData.role = parsedRole;
        }
      }
      if (password !== undefined && password !== "") {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      if (email !== undefined && email !== "") {
        updateData.email = email;
      }
      if (req.file) {
        updateData.profile_picture = req.file.filename;
      }

      const updateUser = await UserModel.update(updateData, {
        where: { id_user: target_id_user },
      });

      res.status(201).json({
        message: "Success",
        data: updateUser,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  getUserByID: async (req, res) => {
    try {
      const target_id_user = req.query.id_user;
      const user = await UserModel.findOne({
        where: { id_user: target_id_user },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let profilePicture = user.profile_picture;

      if (!profilePicture) {
        profilePicture = "default.png";
      } else {
        profilePicture = `${profilePicture}`;
      }

      const picPath = `${protocol}:${process.env.PORT}/img/profile/${profilePicture}`;
      user.profile_picture = picPath;

      res.status(200).json({
        message: "Success",
        data: user,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  addUser: async (req, res) => {
    try {
      const id_user = req.decript.id_user;
      const superAdmin = await UserModel.findOne({ where: { id_user } });

      if (!superAdmin || superAdmin.role !== 3) {
        return res.status(403).json({
          message: "You do not have permission to perform this action",
        });
      }

      const { username, phone_number, full_name, role, password, email } =
        req.body;

      if (
        !username ||
        !phone_number ||
        !full_name ||
        !role ||
        !password ||
        !email
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const existingUser = await UserModel.findOne({ where: { username } });

      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const parsedRole = parseInt(role, 10);

      if (parsedRole !== 1 && parsedRole !== 2) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        username,
        phone_number,
        full_name,
        role: parsedRole,
        password: hashedPassword,
        email,
        status: 2, // Set status to 2 (verified)
      };

      if (req.file) {
        newUser.profile_picture = req.file.filename;
      } else {
        newUser.profile_picture = "default.png";
      }

      const createdUser = await UserModel.create(newUser);

      res.status(201).json({
        message: "User created successfully",
        data: createdUser,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
};
