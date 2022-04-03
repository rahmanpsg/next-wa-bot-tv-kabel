import express from "express";
import socketio from "socket.io";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import waRoutes from "./routes/wa";
import userRoutes from "./routes/user";
import pengaduanRoutes from "./routes/pengaduan";
import pembayaranRoutes from "./routes/pembayaran";
import rekeningRoutes from "./routes/rekening";
import totalRoutes from "./routes/total";

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
app.use("/api/pengaduan", pengaduanRoutes);
app.use("/api/pembayaran", pembayaranRoutes);
app.use("/api/rekening", rekeningRoutes);
app.use("/api/total", totalRoutes);

module.exports = { app, io };
