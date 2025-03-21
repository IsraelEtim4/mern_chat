import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json()); //for parsing application/json

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("sendMessage", (message) => {
    console.log("message: ", message);
    io.emit("recieveMessage", message)
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});