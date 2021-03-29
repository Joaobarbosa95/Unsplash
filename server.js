const express = require("express");
const path = require("path");
const fs = require("fs");
require("./mongoose");
const Image = require("./img-model");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
const staticFiles = path.join(__dirname, "./public");
app.use(express.json());

app.use(express.static(staticFiles));

// dynamic index
app.get("/", async (req, res) => {
  // not static html
  const indexPath = path.join(__dirname, "./dynamic-files/index.html");
  const index = fs.readFileSync(indexPath).toString();
  res.status(200).send(index);
});

// path to retrive photos in database to dynamically render them
app.get("/photos", async (req, res) => {
  try {
    const images = await Image.find({});
    res.status(200).send(images);
  } catch (e) {
    res.status(400).send(e);
  }
});

// path to upload photos
app.post("/photos", async (req, res) => {
  console.log(req.body);
  const image = new Image({
    ...req.body,
  });

  try {
    await image.save();
    res.status(201).send(image);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// path to delete photos
app.delete("/photos", async (req, res) => {
  try {
    const object = mongoose.Types.ObjectId(req.body.objectId);
    await Image.findOneAndDelete({ _id: object });
    res.status(200).send();
  } catch (e) {
    console.log(e.message);
    res.status(500).send();
  }
});

app.get("/input", (req, res) => res.status(200).send());
app.listen(port, () => console.log("Server running on port %s", port));
