import express from "express";
import PembayaranController from "../controller/pembayaran";
const router = express.Router();

router.get("/", PembayaranController.getAll);
router.put("/:id", PembayaranController.put);

// router.get("/:telpon", async (req, res) => {
//   try {
//     const telpon = req.params.telpon;

//     // const totalBulan = 12;

//     // periksa daftar iuran yang belum dibayar
//     const arrBulan = await PembayaranController.cekPembayaran(telpon, true);

//     // const total = await PembayaranController.getTotalPembayaran(
//     //   totalBulan!,
//     //   arrBulan
//     // );

//     // console.log(total);

//     // res.send(total);

//     //
//     const pembayaran = await PembayaranController.savePembayaran(
//       telpon,
//       arrBulan,
//       ""
//     );

//     res.send(pembayaran);
//   } catch (error) {
//     res.status(500).send({ error: true, message: error });
//   }
// });

export default router;
