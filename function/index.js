const firebase = require("firebase");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const socketIo = require("socket.io");
const http = require("http");
const port = process.env.PORT || 4001;
app.use(cors({ origin: true }));

const server = http.createServer(app);

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-api-9a206.firebaseio.com",
});

const db = admin.firestore();

const io = socketIo(server);
// desi se kada se neko konektovao, uzima svoj soket
io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);
  console.log(socket.request.sessionID);

  socket.on("reconnect", (socket) => {
    console.log("Client reconnected: " + socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("getRoomList", () => {
    console.log("getRoomList");
    const roomDb = db.collection("room");
    let rez = [];
    const b = roomDb.get().then((data) => {
      data.forEach((doc) => {
        rez.push({
          id: doc.id,
          name: doc.data().name,
        });
      });
      io.emit("roomList", rez);
      return true;
    });
  });

  //vrati podatke o konkretnoj osobi
  socket.on("userLogin", (roomIdData) => {
    console.log("user login: " + roomIdData.roomId);

    const roomDb = db.collection("room").doc(roomIdData.roomId);
    const a = roomDb.get().then((doc) => {
      socket.emit("roomDetails", doc.data());
      return true;
    });

    const messsagesDb = db
      .collection("room")
      .doc(roomIdData.roomId)
      .collection("messages")
      .orderBy("timestamp");
    const b = messsagesDb.get().then((data) => {
      let rez = [];
      data.forEach((doc) => {
        rez.push({
          id: doc.id,
          user: doc.data().user,
          userImage: doc.data().userImage,
          timestamp: doc.data().timestamp,
          message: doc.data().message,
        });
      });
      socket.emit("userLoged", rez);
      return true;
    });
  });

  socket.on("addRoom", (newRoomData) => {
    console.log("add room");
    db.collection("room")
      .add({
        name: newRoomData.name,
      })
      .then((res) => {
        const roomDb = db.collection("room");
        let rez = [];
        const b = roomDb.get().then((data) => {
          data.forEach((doc) => {
            rez.push({
              id: doc.id,
              name: doc.data().name,
            });
          });
          io.emit("roomList", rez);
          return true;
        });
      });
  });

  socket.on("sendMessage", (poruka) => {
    console.log("New message arrived from client:" + poruka.channelId);

    let data = JSON.parse(
      JSON.stringify({
        message: poruka.input,
        timestamp: Date.now(),
        user: poruka.user,
        userImage: poruka.photoURL,
      })
    );

    const a = db
      .collection("room")
      .doc(poruka.channelId)
      .collection("messages")
      .add(data)
      .then((res) => {
        data.id = res.id;
        data.roomId = poruka.channelId;
        io.emit("addMessageFromServer", data);
        return true;
      });
  });
});
