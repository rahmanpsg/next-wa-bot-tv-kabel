import { Request, Response } from "express";
import { Model } from "mongoose";
import { IUser } from "../models/user";
import { IPengaduan } from "../models/pengaduan";
const userModel: Model<IUser> = require("../models/user");
const pengaduanModel: Model<IPengaduan> = require("../models/pengaduan");

class TotalController {
  async get(_: Request, res: Response) {
    const user = await userModel.countDocuments({ role: "pelanggan" });

    const newUser = await userModel.countDocuments({
      role: "pelanggan",
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    const pengaduan = await pengaduanModel.countDocuments();

    res.send({ error: false, total: { user, newUser, pengaduan } });
  }
}

export default new TotalController();
