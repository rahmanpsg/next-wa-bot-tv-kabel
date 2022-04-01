import express from "express";
import { body, param } from "express-validator";
import validate from "../middleware/validator";
import RekeningController from "../controller/rekening";
import { Model } from "mongoose";
import { IRekening } from "../models/rekening";

const rekeningModel: Model<IRekening> = require("../models/rekening");
const router = express.Router();

router.get("/", RekeningController.getAll);
router.post(
  "/",
  validate([
    body("nama").custom((nama) =>
      rekeningModel
        .findOne({ nama })
        .then((rekening) => rekening && Promise.reject("telah terdaftar"))
    ),
    body("nomor")
      .isInt()
      .custom((nomor) =>
        rekeningModel
          .findOne({ nomor })
          .then((rekening) => rekening && Promise.reject("telah terdaftar"))
      ),
  ]),
  RekeningController.post
);
router.put("/:id", validate([param("id").notEmpty()]), RekeningController.put);
router.delete(
  "/:id",
  validate([param("id").notEmpty()]),
  RekeningController.delete
);

export default router;
