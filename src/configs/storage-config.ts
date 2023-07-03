import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    let error = null;

    cb(error, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
