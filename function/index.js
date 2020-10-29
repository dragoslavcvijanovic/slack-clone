
const firebase = require("firebase");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const socketIo = require("socket.io");
const http = require("http");
const port = process.env.PORT || 4001;
var stream = require("stream");

app.use(cors({ origin: true }));

const server = http.createServer(app);

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-api-9a206.firebaseio.com",
});

const db = admin.firestore();

const io = socketIo(server);

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
    console.log("ädd room");
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
  socket.on("saljemFajl", (poruka) => {
    console.log("saljem fajl sa sa klineta stigao:");
    console.log(poruka);
    //socket.broadcast.emit("serverVamSaljeFajl", poruka)
    // io.emit("serverSaljeFajl", poruka)
    const b = db
      .collection("files")
      .add(poruka)
      .then((res) => {
        poruka.id = res.id;

        let data = JSON.parse(
          JSON.stringify({
            message: "<a |/downloadFile/" + poruka.id + "|" + poruka.ime + "|",
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
});

// read item
app.get("/downloadFile/:item_id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("files").doc(req.params.item_id);
      let item = await document.get();
      let response = item.data();
      // return res.status(200).send(response.content);

      var fileContents = response.content;

      var readStream = new stream.PassThrough();
      readStream.end(fileContents);

      res.set("Content-disposition", "attachment; filename=" + item.data().ime);
      res.set("Content-Type", item.data().type);

      readStream.pipe(res);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

exports.app = functions.https.onRequest(app);

server.listen(port, () => console.log(`Listening on port ${port}`));

app.listen(3001);
