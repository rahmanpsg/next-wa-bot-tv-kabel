import express from "express";
import { createSession, getSession, deleteSession } from "../whatsapp";

const router = express.Router();

const MSG_STARTED = "Whatsapp Bot Telah Berjalan";
const MSG_STOPED = "Whatsapp Bot Telah Dimatikan";
const MSG_NOT_STARTED = "Whatsapp Bot Belum Berjalan";

router.get("/", async (_, res) => {
  const message = getSession() == null ? MSG_NOT_STARTED : MSG_STARTED;

  res.status(200).send({
    error: false,
    message,
    run: getSession() != null,
  });
});

router.post("/run", async (req: any, res) => {
  if (getSession() != null) {
    res.status(200).send({
      error: false,
      message: MSG_STARTED,
    });
  } else {
    createSession(res, req.io);
  }
});

router.post("/stop", async (_, res) => {
  const session = getSession();
  if (session != null) {
    session.logout();
    deleteSession();

    res.status(200).send({
      error: false,
      message: MSG_STOPED,
      run: false,
    });
  } else {
    res.status(200).send({
      error: false,
      message: MSG_NOT_STARTED,
      run: false,
    });
  }
});

export default router;
