import multer from 'multer'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errHandler = (err, req, res, next) => {
  const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statuscode).json({
    status: "fail",
    message: err?.message,
  });
};


const store = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (
      ext !== ".mp4" &&
      ext !== ".mkv" &&
      ext !== ".jpeg" &&
      ext !== ".jpg" &&
      ext !== ".png"
    ) {
      cb(new Error("File format is not supported"), false);
      return;
    }
    cb(null, true);
  },
});


export { notFound, errHandler,store };