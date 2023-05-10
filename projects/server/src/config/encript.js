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
    let token = req.token;
    jwt.verify(token, "cnc!", (err, decript) => {
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
};
