import express from "express";
import { Model } from "mongoose";
import { IUser } from "../models/user";
import authMiddleware from "../middleware/auth";

const userModel: Model<IUser> = require("../models/user");
const router = express.Router();

router.get("/", authMiddleware, async (_, res) => {
  const users = await userModel.find({ role: "pelanggan" });

  res.send(users);
});

// router.post("/", async (req, res) => {});

export default router;
