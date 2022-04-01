import { Request, Response } from "express";
import { Model } from "mongoose";
import { IRekening } from "../models/rekening";

const rekeningModel: Model<IRekening> = require("../models/rekening");

class RekeningController {
  async get(id: string) {
    const rekening = await rekeningModel.findById(id);
    return rekening;
  }
  async getAll(_?: Request, res?: Response) {
    const rekenings = await rekeningModel.find();

    if (res) {
      res.send({ error: false, rekenings });
    } else {
      return rekenings;
    }
  }

  async post(req: Request, res: Response) {
    try {
      const { nama, nomor } = req.body;

      const rekening = await rekeningModel.create({
        nama,
        nomor,
      });

      rekening.save((err, doc) => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
          error: false,
          message: "Data rekening berhasil disimpan",
          rekening: doc,
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
      const { nama, nomor } = req.body;

      rekeningModel.findByIdAndUpdate(
        id,
        { nama, nomor },
        { new: true },
        (err, doc) => {
          if (err) return res.status(500).send({ message: err });
          res.status(200).send({
            error: false,
            message: "Data rekening berhasil diubah",
            rekening: doc,
          });
        }
      );
    } catch (error) {
      res
        .status(500)
        .send({ error: true, message: "Data rekening gagal diubah" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      rekeningModel.deleteOne({ _id: id }, (err) => {
        if (err) return res.status(500).send({ error: true, message: err });

        res.status(200).send({
          error: false,
          message: "Rekening berhasil dihapus",
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
}

export default new RekeningController();
