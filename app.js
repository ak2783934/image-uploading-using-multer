const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

//set multer storage
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
  //allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  //check the ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("error: Images only!");
  }
}

//upload init
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

//app
const app = express();

//EJS
app.set("view engine", "ejs");

//public folder
app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));

app.post("/upload", upload.single("image"), (req, res, next) => {
  if (res.error) {
    res.render("index", { msg: err });
  } else {
    console.log(req.file);
    if (req.file == "undefined") {
      res.render("index", { msg: "Please select Image" });
    } else {
      res.render("index", {
        msg: "File uploaded!",
        file: `uploads/${req.file.filename}`,
      });
    }
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
