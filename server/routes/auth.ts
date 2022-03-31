import express from "express";
import AuthController from "../controller/auth";

const router = express.Router();

router.get("/", AuthController.verifyToken);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);

export default router;
