import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json()); //for parsing application/json

let users = {};

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  // After complete commit
  socket.on("setUsername", (username) => {
    users[socket.id] = username;
    console.log("users", users);
  });

  socket.on("sendMessage", (message) => {
    console.log("message: ", message);
    // 
    const username = users[socket.id] || "Anonymous";

    io.emit("recieveMessage", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    // 
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log(`listening on port: ${port}`);
});
