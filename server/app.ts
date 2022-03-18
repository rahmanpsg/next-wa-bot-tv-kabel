import express from "express";
import socketio from "socket.io";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import waRoutes from "./routes/wa";
import userRoutes from "./routes/user";

const io: socketio.Server = new socketio.Server();

io.on("connection", (socket: socketio.Socket) => {
  console.log("socketio : client connection");

  socket.on("disconnect", () => {
    console.log("socketio : client disconnected");
  });
});

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use((req: any, _, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/wa", waRoutes);
app.use("/api/user", userRoutes);

module.exports = { app, io };
