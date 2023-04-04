const jwt = require("jsonwebtoken");

module.exports = {
  authUser: (req, res, next) => {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      "cnc!",
      (err, decript) => {
        if (err) {
          return res.status(401).send({
            success: false,
            message: "Authenticate token failed",
          });
        }
        req.decript = decript;
        next();
      }
    );
  },
  authAdmin: (req, res, next) => {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      "cnc!",
      (err, decript) => {
        if (err) {
          return res.status(401).send({
            success: false,
            message: "Authenticate token failed",
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
      }
    );
  },
};
