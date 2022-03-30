import express from "express";
import { Model } from "mongoose";
import { IPembayaran } from "../models/pembayaran";

const pembayaranModel: Model<IPembayaran> = require("../models/pembayaran");
const router = express.Router();

router.get("/", async (_, res) => {
  const pembayarans = await pembayaranModel
    .find()
    .populate("user", "nik nama")
    .sort({ createddAt: -1 });

  res.send({ error: false, pembayarans });
});

router.put("/", async (req, res) => {
  try {
    const { id, status } = req.body;

    pembayaranModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
      (err, doc) => {
        if (err) return res.status(500).send({ message: err });
        res.status(200).send({
          error: false,
          message: "Data pembayaran berhasil dikonfirmasi",
          pembayaran: doc,
        });
      }
    );
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "Data pembayaran gagal dikonfirmasi" });
  }
});

export default router;
