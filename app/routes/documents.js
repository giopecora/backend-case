module.exports = app => {
  const documents = require("../controllers/documents.controller.js");
  const multer = require('multer');
  const { uuid } = require('uuidv4')

  const upload = multer({ 
    dest: 'uploads/',
    limits: {
      fileSize: 1000000
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|png|pdf|csv)$/)) {
        return cb(new Error("Please upload a jpg, png, pdf or csv"))
      }
      cb(null, true)
    },
    storage: multer.diskStorage({
      destination: 'uploads/',
      filename(req, file, callback) {
        const fileName = `${uuid()}-${file.originalname}`
  
        return callback(null, fileName)
      },
    }),
  });

  var router = require("express").Router();

  router.post("/", upload.single('file'), documents.create);

  router.get("/", documents.findAll);
  
  router.get("/:id", documents.findOne);
  
  router.get("/getContent/:id", documents.getContent);

  router.put("/:id", upload.single('file'), documents.update);

  router.delete("/:id", documents.delete);


  app.use("/api/documents", router);
};
