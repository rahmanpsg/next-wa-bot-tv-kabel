import express from "express";
import PengaduanController from "../controller/pengaduan";

const router = express.Router();

router.get("/", PengaduanController.getAll);

export default router;
