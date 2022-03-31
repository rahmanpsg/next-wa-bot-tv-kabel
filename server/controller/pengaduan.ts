import { Request, Response } from "express";
import { Model } from "mongoose";
import { IPengaduan } from "../models/pengaduan";
import { IUser } from "../models/user";

const pengaduanModel: Model<IPengaduan> = require("../models/pengaduan");
const userModel: Model<IUser> = require("../models/user");

class PengaduanController {
  async getAll(_: Request, res: Response) {
    const pengaduans = await pengaduanModel
      .find()
      .populate("user", "nik nama")
      .sort({ createdAt: -1 });

    res.send({ error: false, pengaduans });
  }

  async save(telpon: string, pengaduan: string) {
    const user = await userModel.findOne({ telpon });

    pengaduanModel.create({
      user: user?._id,
      pengaduan,
    });
  }
}

export default new PengaduanController();
