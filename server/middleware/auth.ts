import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";

const config = process.env;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return res
      .status(403)
      .send({ error: true, message: "Token diperlukan untuk otentikasi" });
  }
  try {
    jsonwebtoken.verify(jwt, config.TOKEN_KEY!);
  } catch (err) {
    return res.status(401).send({ error: true, message: "Token Tidak Valid" });
  }
  return next();
};

export default authMiddleware;
