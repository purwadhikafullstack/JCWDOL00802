const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  hashPassword: (pass) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pass, salt);
  },
  cetakToken: (payload, expired = "24h") => {
    let token = jwt.sign(payload, "cnc!", { expiresIn: expired });
    return token;
  },
  readToken: (req, res, next) => {
    // pengecekan token
    jwt.verify(req.token, "cnc!", (err, decript) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authenticate token failed ⚠️",
        });
      }
      req.decript = decript;
      next();
    });
  },
  readAdmin: (req, res, next) => {
    jwt.verify(req.token, "cnc!", (err, decript) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authenticate token failed ",
        });
      }
      if (decript.role == 2 || decript.role == 3) {
        req.decript = decript;
        next();
      } else {
        return res.status(401).send({
          success: false,
          message: "aha",
        });
      }
    });
  },
};
