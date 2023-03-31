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
};
