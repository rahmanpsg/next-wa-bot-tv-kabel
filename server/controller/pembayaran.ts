import { Request, Response } from "express";
import { Model, Types } from "mongoose";
import { IPembayaran } from "../models/pembayaran";
import { IUser } from "../models/user";
import { generateMonthsAndYears } from "../utils/date";
import { formatRupiah } from "../utils/stringFormat";

const pembayaranModel: Model<IPembayaran> = require("../models/pembayaran");
const userModel: Model<IUser> = require("../models/user");

class PembayaranController {
  async getAll(_: Request, res: Response) {
    const pembayarans = await pembayaranModel
      .find({
        foto: {
          $exists: true,
        },
      })
      .populate("user", "nik nama")
      .populate("rekening", "nama")
      .sort({ createdAt: -1 });

    const result = pembayarans.map((pembayaran) => {
      const total = formatRupiah(pembayaran.total);
      const metode = pembayaran.rekening
        ? `Transfer ${(pembayaran.rekening as any).nama}`
        : "Tunai";
      return { ...pembayaran.toJSON(), total, metode };
    });

    res.send({ error: false, pembayarans: result });
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

  // mengambil data pembayaran yang belum dikonfirmasi
  async geyByTelpon(telpon: string) {
    const user = await userModel.findOne({ telpon });

    // periksa jika ada data pembayaran yang belum dikonfirmasi
    const pembayaran = await pembayaranModel
      .findOne({
        user: user!._id,
        foto: {
          $exists: false,
        },
      })
      .sort({ createdAt: -1 });

    if (!pembayaran) {
      throw "Anda belum memiliki data pembayaran";
    } else {
      return pembayaran;
    }
  }

  async savePembayaran(
    telpon: string,
    bulan: Array<String>,
    total: number,
    idRekening?: string
  ) {
    const user = await userModel.findOne({ telpon });

    // periksa jika ada data pembayaran yang belum dikonfirmasi
    const pembayaran = await pembayaranModel
      .findOne({
        user: user!._id,
        foto: {
          $exists: false,
        },
      })
      .sort({ createdAt: -1 });

    if (pembayaran) {
      if (idRekening) pembayaran.rekening = new Types.ObjectId(idRekening);
      pembayaran.bulan = bulan as Array<string>;
      pembayaran.total = total;
      await pembayaran.save();
      return { pembayaran, bulan };
    }
    // buat data pembayaran baru
    else {
      const pembayaran = new pembayaranModel({
        user: user!._id,
        rekening: idRekening,
        bulan,
        total,
      });

      await pembayaran.save();
      return { pembayaran, bulan };
    }
  }

  async saveBuktiPembayaran(id: string, fotoUrl: string) {
    const pembayaran = await pembayaranModel.findByIdAndUpdate(
      id,
      { foto: fotoUrl },
      { new: true }
    );
    return pembayaran;
  }

  async cekPembayaran(telpon: string, get: boolean = false) {
    const user = await userModel.findOne({ telpon });
    const pembayarans = await pembayaranModel.find({
      user: user!._id,
      status: true,
    });

    const tanggalDaftar = new Date(user!.createdAt);

    const arrBulan = generateMonthsAndYears(tanggalDaftar);

    if (arrBulan.length == 0) throw "Anda belum memiliki data pembayaran";

    console.log(arrBulan);

    for (const pembayaran of pembayarans) {
      for (const bulan of pembayaran.bulan) {
        arrBulan.includes(bulan)
          ? arrBulan.splice(arrBulan.indexOf(bulan), 1)
          : console.log("not found");
      }
    }

    if (!get)
      if (arrBulan.length > 0)
        throw "Anda belum membayar iuran pada bulan " + arrBulan.join(", ");
      else throw "Anda tidak memiliki tunggakan pembayaran";
    else return arrBulan;
  }

  async getTotalPembayaran(totalBulan: number, arrBulan: Array<string>) {
    if (arrBulan.length == 0) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + totalBulan);

      const bulans = generateMonthsAndYears(startDate, endDate);
      const total = totalBulan * 25000;

      return {
        bulans,
        total,
      };
    } else {
      const bulanAwal = arrBulan[0].split("/");

      console.log(bulanAwal);

      const startDate = new Date();
      startDate.setFullYear(parseInt(bulanAwal[1]), parseInt(bulanAwal[0]) - 2);

      const endDate = new Date();
      endDate.setFullYear(
        parseInt(bulanAwal[1]),
        parseInt(bulanAwal[0]) - 1 + totalBulan
      );

      console.log(startDate);
      console.log(endDate);

      const bulans = generateMonthsAndYears(startDate, endDate);

      console.log(bulans);

      // total pembayaran + denda
      const total = totalBulan * 25000 + arrBulan.length * 5000;

      return {
        bulans,
        total,
      };
    }
  }
}

export default new PembayaranController();
