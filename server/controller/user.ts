import { Request, Response } from "express";
import { Model } from "mongoose";
import { IUser } from "../models/user";
const userModel: Model<IUser> = require("../models/user");

class UserController {
  async getAll(_: Request, res: Response) {
    const users = await userModel
      .find({ role: "pelanggan" })
      .sort({ createdAt: -1 });

    res.send({ error: false, users });
  }

  async post(req: Request, res: Response) {
    try {
      const { nik, nama, telpon, alamat } = req.body;

      const user = await userModel.create({
        nik,
        nama,
        telpon,
        alamat,
      });

      user.save((err, doc) => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
          error: false,
          message: "Data pelanggan berhasil disimpan",
          user: doc,
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: true,
        message: "Data gagal ditambahkan, terjadi masalah di server",
      });
    }
  }

  async put(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { nik, nama, telpon, alamat } = req.body;

      const newData = { nik, nama, telpon, alamat };

      userModel.findByIdAndUpdate(id, newData, { new: true }, (err, doc) => {
        if (err) return res.status(500).send({ error: true, message: err });

        res.status(200).send({
          error: false,
          message: "Pelanggan berhasil diubah",
          user: doc,
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: true,
        message: "Data gagal diubah, terjadi masalah di server",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      userModel.deleteOne({ _id: id }, (err) => {
        if (err) return res.status(500).send({ error: true, message: err });

        res.status(200).send({
          error: false,
          message: "Pelanggan berhasil dihapus",
          id,
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: true,
        message: "Data gagal diubah, terjadi masalah di server",
      });
    }
  }

  async cekUser(telpon: string) {
    return await userModel.countDocuments({ telpon });
  }

  async save(nik: number, nama: string, telpon: string, alamat: string) {
    const user = await userModel.create({
      nik,
      nama,
      alamat,
      telpon,
    });

    user.save((err) => {
      if (err)
        throw "Terjadi masalah di server. Silahkan coba beberapa saat lagi.";
    });
  }
}

export default new UserController();
