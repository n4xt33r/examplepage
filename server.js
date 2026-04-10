const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// create uploads folder if not exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// serve static files
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

// upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ path: "/uploads/" + req.file.filename });
});

// list images
app.get("/images", (req, res) => {
  const files = fs.readdirSync("uploads");
  const paths = files.map(f => "/uploads/" + f);
  res.json(paths);
});

app.listen(PORT, () => console.log("Server running on " + PORT));