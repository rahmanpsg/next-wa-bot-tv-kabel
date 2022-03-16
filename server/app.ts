require("./config/database").connect();

import express from 'express';
import cookieParser from "cookie-parser";

const app = express()

app.use(cookieParser())
app.use(express.json());

const authRoute = require("./routes/auth");

app.use("/api/auth", authRoute);

module.exports = app