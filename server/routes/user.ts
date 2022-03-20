import express from "express";
import { body, param } from "express-validator";
import { Model } from "mongoose";
import { IUser } from "../models/user";
// import authMiddleware from "../middleware/auth";
import validate from "../middleware/validator";

const userModel: Model<IUser> = require("../models/user");
const router = express.Router();

router.get("/", async (_, res) => {
  const users = await userModel
    .find({ role: "pelanggan" })
    .sort({ createddAt: -1 });

  res.send({ error: false, users });
});

router.post(
  "/",
  validate([
    body("nik")
      .isInt()
      .isLength({ min: 16, max: 16 })
      .withMessage("harus 16 angka")
      .custom((nik) =>
        userModel
          .findOne({ nik })
          .then((user) => user && Promise.reject("telah terdaftar"))
      ),
    body("nama").notEmpty(),
    body("telpon")
      .isMobilePhone("id-ID")
      .custom((telpon) =>
        userModel
          .findOne({ telpon })
          .then((user) => user && Promise.reject("telah terdaftar"))
      ),
    body("alamat").notEmpty(),
  ]),
  async (req, res) => {
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
);

router.put(
  "/",
  validate([
    body("id").notEmpty(),
    body("nik")
      .isInt()
      .isLength({ min: 16, max: 16 })
      .withMessage("harus 16 angka")
      .custom((nik, { req }) =>
        userModel
          .findOne({ nik })
          .then(
            (user) =>
              user &&
              user.id != req.body.id &&
              Promise.reject("telah terdaftar")
          )
      ),
    body("nama").notEmpty(),
    body("telpon")
      .isMobilePhone("id-ID")
      .custom((telpon, { req }) =>
        userModel
          .findOne({ telpon })
          .then(
            (user) =>
              user &&
              user.id != req.body.id &&
              Promise.reject("telah terdaftar")
          )
      ),
    body("alamat").notEmpty(),
  ]),
  async (req, res) => {
    try {
      const { id, nik, nama, telpon, alamat } = req.body;

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
);

router.delete("/:id", validate([param("id").notEmpty()]), async (req, res) => {
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
});

export default router;
