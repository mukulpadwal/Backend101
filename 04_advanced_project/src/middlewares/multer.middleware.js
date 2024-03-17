// This line imports the Multer package into your code. multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
import multer from "multer";

const storage = multer.diskStorage({
  // destination is used to determine within which folder the uploaded files should be stored.
  destination: function (req, file, cb) {
    cb(null, "./public/temp/");
  },

  // filename is used to determine what the file should be named inside the folder.
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
