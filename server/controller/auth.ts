import { Request, Response } from "express";
import { Model } from "mongoose";
import { IUser } from "../models/user";
import jsonwebtoken from "jsonwebtoken";

const userModel: Model<IUser> = require("../models/user");

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      userModel.findOne({ username }).exec((err: any, doc: any) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }

        if (!doc) {
          return res
            .status(404)
            .send({ error: true, message: "Username tidak ditemukan" });
        }

        if (password != doc.password) {
          return res
            .status(401)
            .send({ error: true, message: "Username atau password salah" });
        }

        const user = doc.toJSON();

        // Create token
        const token = jsonwebtoken.sign(
          { id: user._id, username },
          process.env.TOKEN_KEY!,
          {
            expiresIn: "7 days",
          }
        );

        // set cookie
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 1, // 1 hari
          path: "/",
        });

        user.id = user._id;
        user.token = token;

        res.status(200).send({
          error: false,
          message: "Anda berhasil login",
          user,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async logout(req: Request, res: Response) {
    const { jwt } = req.cookies;

    if (!jwt) {
      return res.status(404).send({ error: true, message: "Anda belum login" });
    }

    res.clearCookie("jwt");

    res.status(200).send({
      error: false,
      message: "Anda berhasil logout",
    });
  }

  async verifyToken(req: Request, res: Response) {
    const { jwt } = req.cookies;

    if (!jwt) {
      return res
        .status(404)
        .send({ error: true, message: "Token tidak valid" });
    }

    res.status(200).send({
      error: false,
      message: "Token valid",
    });
  }
}

export default new AuthController();
