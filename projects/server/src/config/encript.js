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
    console.log("read token jalan");
    // pengecekan token
    jwt.verify(req.token, "cnc!", (err, decript) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authenticate token failed ⚠️",
        });
      }
      console.log(decript);
      req.decript = decript;
      next();
    });
  },
};
