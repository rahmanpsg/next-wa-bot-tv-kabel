import express from "express";
import TotalController from "../controller/total";

const router = express.Router();

router.get("/", TotalController.get);

export default router;
