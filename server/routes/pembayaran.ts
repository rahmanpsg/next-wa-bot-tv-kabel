import express from "express";
import PembayaranController from "../controller/pembayaran";
const router = express.Router();

router.get("/", PembayaranController.getAll);
router.put("/", PembayaranController.put);

router.get("/:telpon", async (req, res) => {
  try {
    const telpon = req.params.telpon;

    await PembayaranController.cekPembayaran(telpon);
  } catch (error) {
    res.status(500).send({ error: true, message: error });
  }
});

export default router;
