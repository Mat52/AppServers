//======zmienne stałe======//
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const PORT = process.env.PORT || 3000;

//======pliki statyczne======//
app.use(express.static("dist"));

//======testowa tablica na użytkowników======//
let users = [];

//======get intro.html======//
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/intro.html"));
});

//======zdarzenie połączenia z socketem======//
io.on("connection", (socket) => {
  console.log("a user connected");
  //======zdarzenie rejestracji użytkownika======//
  socket.on("register user", (user) => {
    console.log(`REGISTERED ${user}!`);
    if (users.indexOf(user) == -1 && users.length < 2) users.push(user);
    io.emit("users", users); //odesłanie do klienta
  });
  //======zdarzenie rozłączenia z socketem======//
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//======nasłuch na określonym porcie======//
server.listen(PORT, function () {
  console.log(`server running at http://localhost:${PORT}/`);
});
