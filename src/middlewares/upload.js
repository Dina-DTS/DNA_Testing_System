import multer from "multer";

const getTextFileUploadMiddleware = (fieldname = "file") => {
  const storage = multer.memoryStorage();

  function fileFilter(req, file, cb) {
    if (file.mimetype === "text/plain") {
      cb(null, true);
    } else {
      cb(new Error("Only text files are allowed!"), false);
    }
  }

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  });

  const uploadMiddleware = upload.single(fieldname);

  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      // Check if file is uploaded
      if (!req.file) {
        // If DNA sequence is not required, continue without setting it
        if (req.method === "PUT" && !req.body.DNA_sequence) {
          return next();
        }
        return res.status(400).json({ message: "Please upload a DNA file" });
      }

      // If file is uploaded successfully, extract its content and add it to request body
      if (req.file) {
        req.body.DNA_sequence = req.file.buffer.toString("utf8");
      }

      next();
    });
  };
};

export default getTextFileUploadMiddleware;
