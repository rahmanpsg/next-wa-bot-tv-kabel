require("./config/database").connect();

import express from 'express';

const app = express()

app.use(express.json());

const loginRoute = require("./routes/login");

app.use("/api/login", loginRoute);

module.exports = app