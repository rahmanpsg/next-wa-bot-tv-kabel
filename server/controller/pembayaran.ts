import { Request, Response } from "express";
import { Model } from "mongoose";
import { IPembayaran } from "../models/pembayaran";
import { IUser } from "../models/user";

const pembayaranModel: Model<IPembayaran> = require("../models/pembayaran");
const userModel: Model<IUser> = require("../models/user");

class PembayaranController {
  async getAll(_: Request, res: Response) {
    const pembayarans = await pembayaranModel
      .find()
      .populate("user", "nik nama")
      .sort({ createdAt: -1 });

    res.send({ error: false, pembayarans });
  }

  async put(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { status } = req.body;

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
  }

  async cekPembayaran(telpon: string) {
    const user = await userModel.findOne({ telpon });
    const pembayarans = await pembayaranModel.find({ user: user!._id });

    const tanggalDaftar = new Date(user!.createdAt);
    const tanggalDaftarString = tanggalDaftar.toLocaleString("id-ID", {
      month: "long",
      year: "numeric",
    });

    const arrBulan = this.generateMonthsAndYears(tanggalDaftarString);

    if (arrBulan.length == 0) throw "Anda belum memiliki data pembayaran";

    console.log(arrBulan);

    for (const pembayaran of pembayarans) {
      for (const bulan of pembayaran.bulan) {
        arrBulan.includes(bulan)
          ? arrBulan.splice(arrBulan.indexOf(bulan), 1)
          : console.log("not found");
      }
    }

    if (arrBulan.length > 0)
      throw "Anda belum membayar iuran pada bulan " + arrBulan.join(", ");
    else throw "Anda tidak memiliki tunggakan pembayaran";
  }

  private generateMonthsAndYears(startingFromDateString: string) {
    const cur = new Date(`15 ${startingFromDateString}`);
    const untilDateString = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      15
    ).toDateString();

    const result = [];

    for (
      ;
      untilDateString !== cur.toDateString();
      cur.setMonth(cur.getMonth() + 1)
    )
      result.push(
        cur.toLocaleString("id-ID", { month: "numeric", year: "numeric" })
      );

    result.splice(0, 1);

    return result;
  }
}

export default new PembayaranController();
