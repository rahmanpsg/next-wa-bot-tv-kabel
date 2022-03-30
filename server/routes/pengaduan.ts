import express from "express";
import { Model } from "mongoose";
import { IPengaduan } from "../models/pengaduan";

const pengaduanModel: Model<IPengaduan> = require("../models/pengaduan");
const router = express.Router();

router.get("/", async (_, res) => {
  const pengaduans = await pengaduanModel
    .find()
    .populate("user", "nik nama")
    .sort({ createddAt: -1 });

  res.send({ error: false, pengaduans });
});

export default router;
