import express from "express";
import { body, param } from "express-validator";
import { Model } from "mongoose";
import { IUser } from "../models/user";
// import authMiddleware from "../middleware/auth";
import validate from "../middleware/validator";
import UserController from "../controller/user";

const userModel: Model<IUser> = require("../models/user");
const router = express.Router();

router.get("/", UserController.getAll);

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
  UserController.post
);

router.put(
  "/:id",
  validate([
    param("id").notEmpty(),
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
              user.id != req.params!.id &&
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
              user.id != req.params!.id &&
              Promise.reject("telah terdaftar")
          )
      ),
    body("alamat").notEmpty(),
  ]),
  UserController.put
);

router.put(
  "/status/:id",
  validate([param("id").notEmpty()]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;

      userModel.findByIdAndUpdate(
        id,
        { aktif: status },
        { new: true },
        (err, doc) => {
          if (err) return res.status(500).send({ error: true, message: err });

          res.status(200).send({
            error: false,
            message: `Status pelanggan berhasil di${
              status ? "aktifkan" : "nonaktifkan"
            }`,
            user: doc,
          });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: true,
        message: "Data gagal diubah, terjadi masalah di server",
      });
    }
  }
);

router.delete(
  "/:id",
  validate([param("id").notEmpty()]),
  UserController.delete
);

export default router;
