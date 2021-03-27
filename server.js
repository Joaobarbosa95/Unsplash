const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const staticFiles = path.join(__dirname, "./public");

app.use(express.static(staticFiles));

app.get("/", (req, res) => {
  res.status(200).send();
});

app.get("/input", (req, res) => res.status(200).send());

app.listen(port, () => console.log("Server running on port %s", port));
