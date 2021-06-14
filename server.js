//======zmienne stałe======//

const { uuid } = require("uuidv4");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const PORT = process.env.PORT || 3000;
const { debugPort } = require("process");

//======BAZA DANYCH======//
var Datastore = require("nedb");

//======ZMIENNE UŻYTKOWNIKA======//
let room = 0;
let clientNo = 0;
let roomNo;
let userkey = "";
var db = {};
let id = (db.players = new Datastore({
  filename: "players.db",
  autoload: true,
}));

//CORS
//======LEVEL JSON======//
var level = require("./src/data/levels/turtle.json");
level.types = [];

//======LOSOWANIE TYPU KAFELKA======//
function randomType() {
  let types = Object.keys(level.eachTotal);
  let randomIndex = Math.floor(Math.random() * types.length);
  let randomType = types[randomIndex];
  return randomType;
}

//======LOSOWANIE NUMERU ELEMENTU Z DANEJ KATEGORII======//
function randomTileNumber(type) {
  return (
    Math.round(Math.random() * (level.eachTotal[`${type}`].length - 1)) + 1
  );
}

//======TWORZERZENIE TABLICY TYPÓW DLA POSZCZEGÓLNEJ PARY ELEMENTÓW======//
level.schema.forEach(function (element, index) {
  let random = randomType();
  console.log(random, randomTileNumber(random));

  level.types.push([random, randomTileNumber(random)]);
});

//======pliki statyczne======//
app.use(express.static("dist"));

//======testowa tablica na użytkowników======//
let users = [];

//======get intro.html======//
app.get("/", function (req, res) {
  res.redirect("intro.html");
});

//======get level======//
app.get("/getLevel", function (req, res) {
  res.json(level);
});

//======get game.html======//
app.get("/game", function (req, res) {
  res.redirect("game.html");
});

//======zdarzenie połączenia z socketem======//
io.on("connection", async (socket) => {
  sock = socket.userkey;
  console.log(sock);
  console.log("a user connected");

  //======zdarzenie dołączenia do gry======//
  socket.on("connectgame", (data) => {
    let opname;
    let userkey = data.userkey;
    userkey = parseFloat(userkey);
    socket.join(data.room);
    socket.join(userkey);

    //======odliczanie======//
    var counter = 300;
    var WinnerCountdown = setInterval(function () {
      io.to(data.room).emit("counter", counter);
      counter--;
      if (counter === 0) {
        io.to(userkey).emit("end", "end");
        clearInterval(WinnerCountdown);
      }
    }, 1000);
    let roomno = data.room;
    roomno = parseInt(roomno);
    db.players.loadDatabase();
    db.players.find({ room: roomno }, function (err, docs) {
      users = docs;
      console.log(docs);
      console.log(userkey);
      var __FOUND = docs.find(function (post, index) {
        if (post.userkey != userkey) {
          console.log("tak");
          return true;
        }
      });
      if (__FOUND.userkey != undefined) {
        opname = __FOUND.name;
        io.to(userkey).emit("opname", opname);
      }
    });
  });
  //======zdarzenie usunięcia pary elementów przez użytkownika======//
  socket.on("hittile", (data) => {
    console.log(data);
    userkey = data.userkey;
    userkey = parseFloat(userkey);
    room = data.room;
    let roomno = data.room;
    roomno = parseInt(roomno);
    console.log(typeof roomno);
    let points;
    let opname;

    db.players.loadDatabase();
    db.players.find({ room: roomno }, function (err, docs) {
      users = docs;
      console.log(docs);
      console.log(userkey);
      var __FOUND = docs.find(function (post, index) {
        if (post.userkey == userkey) {
          console.log("tak");
          return true;
        }
      });

      if (__FOUND != undefined) {
        points = __FOUND.points;
        points++;
        let data1 = {
          tile1: data.tile1,
          tile2: data.tile2,
          points: points,
          nick: __FOUND.name,
        };

        //======aktualizacja bazy danych======//
        db.players.update(
          { userkey: __FOUND.userkey },
          { $set: { points: points } },
          {}, // this argument was missing
          function (err, numReplaced) {
            console.log("replaced---->" + numReplaced);
          }
        );

        db.players.find({ room: __FOUND.room }, function (err, docs) {
          users = docs;

          var __FOUND1 = docs.find(function (post, index) {
            if (post.userkey != userkey) return true;
          });

          if (__FOUND1 != undefined) {
            console.log(data1);
            console.log(__FOUND1.userkey);
            io.to(__FOUND1.userkey).emit("opscore", { data1 });
          }
        });
      }
    });
  });
  //======zdarzenie rejestracji użytkownika======//
  socket.on("register user", (user) => {
    let userkey = Math.random() * 10;
    let username = user;

    clientNo++;

    socket.join(Math.round(clientNo / 2));
    roomNo = Math.round(clientNo / 2);
    console.log(typeof roomNo);
    socket.on("start-session", function (data) {
      console.log("============start-session event================");
      console.log(data);
      if (data.sessionId == null) {
        console.log(username);
        var session_id = uuidv4(); //generating the sessions_id and then binding that socket to that sessions
        let iddd = session_id;
        socket.join(iddd);
        console.log("joined successfully ");
        io.to(iddd).emit("set-session-acknowledgement", {
          sessionId: session_id,
          userkey: userkey,
          nick: username,
          room: roomNo,
        });
      } else {
        socket.room = data.sessionId; //this time using the same session
        socket.join(socket.room);
        console.log("joined successfully ");
        io.to(socket.room).emit("set-session-acknowledgement", {
          sessionId: data.sessionId,
          userkey: userkey,
          nick: username,
          room: roomNo,
        });
      }
    });
    db.players.loadDatabase();

    db.players.count({}, function (err, count) {
      let userId = userkey;
      socket.userkey = userkey;
      socket.join(userId);

      if (err) {
        console.log("błąd");
      }

      var player = {
        name: user,
        points: 0,
        userkey: userkey,
        room: roomNo,
      };
      io.to(userId).emit("serverMsg", roomNo);
      db.players.insert(player, function (err, newDoc) {});
      db.players.find({ room: roomNo }, function (err, docs) {
        users = docs;
        io.to(userId).emit("users", users);
      });

      db.players.find({ room: roomNo }, function (err, docs) {
        users = docs;

        var __FOUND = docs.find(function (post, index) {
          if (post.userkey != userkey) return true;
        });

        if (__FOUND != undefined) {
          let name = __FOUND.name;

          io.to(userId).emit("oponent", name);
          io.to(__FOUND.userkey).emit("oponent1", user);
        }
      });
    });
  });

  //======zdarzenie rozłączenia z socketem======//
  socket.on("ready", () => {
    db.players.loadDatabase();
    db.players.find({ userkey: socket.userkey }, function (err, docs) {
      users = docs;
      db.players.find({ room: users[0].room }, function (err, docs) {
        users = docs;
        var __FOUND = users.find(function (post, index) {
          if (post.userkey != socket.userkey) return true;
        });
        if (__FOUND != undefined) {
          let userkey = __FOUND.userkey;
          io.to(userkey).emit("opready", userkey);
        }
      });
    });
    socket.on("disconnect", () => {
      if (socket.userkey != undefined) {
        var connectionMessage = socket.userkey + " Disconnected";

        db.players.loadDatabase();
        db.players.find({ userkey: socket.userkey }, function (err, docs) {
          users = docs;

          db.players.find({ room: users[0].room }, function (err, docs) {
            users = docs;
            var __FOUND = users.find(function (post, index) {
              if (post.userkey != socket.userkey) return true;
            });
            if (__FOUND != undefined) {
              let userkey = __FOUND.userkey;
              io.to(userkey).emit("oponentdisconected", userkey);
            }
          });
        });
      }
    });
    socket.on("redirect", () => {
      var destination = "/game";
      let userkey = socket.userkey;
      io.to(userkey).emit("redirect", destination, userkey);
    });
  });

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
});
//======nasłuch na określonym porcie======//
server.listen(PORT, function () {
  console.log(`server running at http://localhost:${PORT}/`);
});
