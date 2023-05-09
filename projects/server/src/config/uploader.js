const multer = require("multer");
const fs = require("fs");

module.exports = {
  uploader: (directory) => {
    let defaultDirectory = "./src/public/img";

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const pathDirectory = directory
          ? defaultDirectory + directory
          : defaultDirectory;
        if (fs.existsSync(pathDirectory)) {
          cb(null, pathDirectory);
        } else {
          fs.mkdir(pathDirectory, { recursive: true }, (err) => {
            if (err) {
              console.log(err);
            }
            cb(err, pathDirectory);
          });
        }
      },
      filename: (req, file, cb) => {
        cb(
          null,
          Date.now() +
            "." +
            file.originalname.split(".")[
              file.originalname.split(".").length - 1
            ]
        );
      },
    });

    const fileFilter = (req, file, cb) => {
      const extFilter = /\.(jpg|jpeg|png)/;
      let check = file.originalname.toLocaleLowerCase().match(extFilter);
      if (check) {
        cb(null, true);
      } else {
        cb(new Error(`Your file ext is denied`, false));
      }
    };

    return multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 3145728,
      },
    });
  },
};
