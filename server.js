//zmienne, stałe

var express = require("express");
var path = require("path");
var app = express();
const PORT = 5000;

app.use(express.static("dist"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/intro.html"));
});

//nasłuch na określonym porcie

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});
