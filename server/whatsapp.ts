import { existsSync, unlinkSync, readdir } from "fs";
import { join } from "path";
import { Boom } from "@hapi/boom";
import {
  makeWALegacySocket,
  useSingleFileLegacyAuthState,
  makeInMemoryStore,
  DisconnectReason,
  LegacySocketConfig,
  Browsers,
  //   delay,
} from "@adiwajshing/baileys";

import { Response } from "express";
import socketio from "socket.io";

const sessionId = "tv_kabel";
const sessions = new Map();
const retries = new Map();

const init = () => {
  readdir(join(__dirname, "sessions"), (err, files) => {
    if (err) throw err;

    for (const file of files) {
      if (
        !file.endsWith(".json") ||
        !file.includes("_session") ||
        file.includes("_store")
      ) {
        continue;
      }

      createSession();
    }
  });
};

const sessionsDir = (store = false) => {
  return join(
    __dirname,
    "sessions",
    sessionId + `${store ? "_store" : "_session"}.json`
  );
};

const shouldReconnect = () => {
  let maxRetries = parseInt(process.env.MAX_RETRIES! ?? 0);
  let attempts = retries.get(sessionId) ?? 0;

  maxRetries = maxRetries < 1 ? 1 : maxRetries;

  if (attempts < maxRetries) {
    ++attempts;

    console.log("Reconnecting...", { attempts, sessionId });
    retries.set(sessionId, attempts);

    return true;
  }

  return false;
};

const createSession = async (
  res: Response | null = null,
  io: socketio.Socket | null = null
) => {
  const store = makeInMemoryStore({});

  const { state, saveState } = useSingleFileLegacyAuthState(sessionsDir());

  const waConfig: Partial<LegacySocketConfig> = {
    auth: state,
    printQRInTerminal: false,
    browser: Browsers.ubuntu("Chrome"),
  };

  const wa = makeWALegacySocket(waConfig);

  store.readFromFile(sessionsDir(true));
  store.bind(wa.ev);

  wa.ev.on("creds.update", saveState);

  //   wa.ev.on("messages.upsert", async (m) => {
  //     const message = m.messages[0];

  //     if (!message.key.fromMe && m.type === "notify") {
  //       await delay(1000);

  //       await wa.sendReadReceipt(
  //         message.key.remoteJid!,
  //         message.key.participant!,
  //         [message.key.id!]
  //       );
  //     }
  //   });

  wa.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    console.log("Status Wa Bot: ", connection);

    if (connection === "open") {
      retries.delete(sessionId);
      sessions.delete(sessionId);

      sessions.set(sessionId, { ...wa, store });

      io?.emit("waBotStatus", "runningWaBot");
    }

    if (connection === "close") {
      const statusCode = (lastDisconnect!.error as Boom)?.output?.statusCode;

      io?.emit("waBotStatus", "stopWaBot");

      if (statusCode === DisconnectReason.loggedOut || !shouldReconnect()) {
        if (res && !res.headersSent) {
          res.status(500).send({
            error: true,
            message: "Gagal membuat sesi",
          });
        }

        return deleteSession();
      }

      setTimeout(
        () => {
          createSession(res);
        },
        statusCode === DisconnectReason.restartRequired
          ? 0
          : parseInt(process.env.RECONNECT_INTERVAL! ?? 0)
      );
    }

    if (update.qr) {
      if (res && !res.headersSent) {
        try {
          const qr = update.qr;

          res.status(200).send({
            error: false,
            message: "Silahkan scan QR Code",
            qr,
          });
        } catch {
          res.status(500).send({
            error: true,
            message: "Gagal membuat QR Code",
          });
        }

        return;
      }

      try {
        await wa.logout();
      } catch {
      } finally {
        deleteSession();
      }
    }
  });
};

const getSession = () => {
  return sessions.get(sessionId) ?? null;
};

const deleteSession = () => {
  if (existsSync(sessionsDir())) {
    unlinkSync(sessionsDir());
  }

  if (existsSync(sessionsDir(true))) {
    unlinkSync(sessionsDir(true));
  }

  sessions.delete(sessionId);
  retries.delete(sessionId);
};

export { init, createSession, getSession, deleteSession };
