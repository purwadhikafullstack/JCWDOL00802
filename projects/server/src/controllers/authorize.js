const jwt = require("jsonwebtoken");

module.exports = {
  authUser: (req, res, next) => {
    console.log(req.headers.authorization);
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      "cnc!",
      (err, decript) => {
        console.log(req.headers.authorization.split(" ")[1]);
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
