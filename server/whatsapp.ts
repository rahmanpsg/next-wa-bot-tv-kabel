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
  delay,
  AnyMessageContent,
  proto,
  //   delay,
} from "@adiwajshing/baileys";

import { Response } from "express";
import socketio from "socket.io";

import { Model } from "mongoose";
import { IUser } from "./models/user";

const userModel: Model<IUser> = require("./models/user");

const sessionId = "tv_kabel";
const sessions = new Map();
const retries = new Map();

const chatSession = new Map<string, string>();
const daftarSession = new Map<
  string,
  { nik: number; nama: string; alamat: string }
>();

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

  wa.ev.on("messages.upsert", async (m) => {
    // if (m.type === "append" || m.type === "notify") {
    //   console.log(JSON.stringify(m, undefined, 2));
    // }

    const msg = m.messages[0];
    if (!msg.key.fromMe && m.type === "notify") {
      console.log(msg.message);

      await wa!.chatRead(msg.key, 1);

      // fungsi untuk membalas pesan
      const messageContent: AnyMessageContent = await checkPesan(
        msg.message!,
        msg.key.remoteJid!
      );

      await sendMessageWTyping(wa, messageContent, msg.key.remoteJid!);
    }
  });

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

// Logic pesan chat bot
async function checkPesan(
  message: proto.IMessage,
  remoteJid: string
): Promise<AnyMessageContent> {
  const buttons = [
    {
      buttonId: "#daftar",
      buttonText: { displayText: "Daftar Baru" },
      type: 1,
    },
    {
      buttonId: "#pengaduan",
      buttonText: { displayText: "Pengaduan" },
      type: 1,
    },
    {
      buttonId: "#pembayaran",
      buttonText: { displayText: "Pembayaran" },
      type: 1,
    },
  ];

  const telpon = remoteJid.split("@")[0];

  // Periksa jika nomor telah terdaftar
  const cekUser = await userModel.countDocuments({ telpon });

  if (cekUser > 0) buttons.splice(0, 1);
  else buttons.splice(-2);

  const messageContent: AnyMessageContent = {
    text: "Halo, saya adalah chat bot TV Kabel. Silahkan pilih layanan yang ingin anda gunakan.",
    footer: "Daftar Layanan",
    buttons: buttons,
  };

  console.log(chatSession);

  if (chatSession.has(remoteJid)) {
    delete messageContent.footer;
    delete messageContent.buttons;
    if (message.buttonsResponseMessage != null)
      // fungsi jika pesan dari tombol
      switch (message.buttonsResponseMessage.selectedButtonId) {
        case "#daftar":
          {
            messageContent.text =
              "Silahkan masukkan data anda sesuai dengan format berikut, \nnama#nik#alamat";
          }
          break;
        case "#daftar_oke":
          {
            try {
              if (daftarSession.has(remoteJid)) {
                const { nik, nama, alamat } = daftarSession.get(remoteJid)!;

                const user = await userModel.create({
                  nik,
                  nama,
                  alamat,
                  telpon,
                });

                user.save((err) => {
                  if (err)
                    throw "Terjadi masalah di server. Silahkan coba beberapa saat lagi.";

                  messageContent.text =
                    "Terimakasih telah mendaftar. \nSilahkan tunggu konfirmasi dari admin";
                });
              }
            } catch (error) {
              console.log(error);
              messageContent.text = error as string;
            }
          }
          break;
        default:
          messageContent.text = "Maaf, layanan tidak tersedia";
      }
    else if (message.conversation != null)
      // fungsi jika pesan di ketik
      switch (chatSession.get(remoteJid)) {
        case "#daftar":
          {
            try {
              const data = message.conversation.split("#");
              const [nama, nik, alamat] = data;

              // Validasi data
              if (data.length !== 3) throw "Maaf, format data anda salah";

              if (nama === "" || nik === "" || alamat === "")
                throw "Maaf, data anda tidak boleh kosong";

              // Validasi nik
              if (Number.isNaN(parseInt(nik)))
                throw "Maaf, format NIK anda salah";
              if (nik.length !== 16) throw "Maaf, NIK harus 16 digit";

              messageContent.text = `Nama : ${nama} \nNIK : ${nik} \nAlamat : ${alamat}`;
              messageContent.footer = "Konfirmasi Data Anda";
              messageContent.buttons = [
                {
                  buttonId: "#daftar_oke",
                  buttonText: { displayText: "Oke" },
                  type: 1,
                },
                {
                  buttonId: "#daftar",
                  buttonText: { displayText: "Ulang" },
                  type: 1,
                },
              ];

              // Menyimpan data ke session sebelum disimpan
              daftarSession.set(remoteJid, {
                nama,
                nik: parseInt(nik),
                alamat,
              });
            } catch (error) {
              message.buttonsResponseMessage = {
                selectedButtonId: "#daftar",
              };
              console.log(error);
              messageContent.text = error as string;
            }
          }
          break;
        default:
          messageContent.text = "Maaf, layanan tidak tersedia";
      }
  }

  chatSession.set(
    remoteJid,
    message.buttonsResponseMessage?.selectedButtonId ?? message.conversation!
  );

  return messageContent;
}

const sendMessageWTyping = async (
  wa: any,
  msg: AnyMessageContent,
  jid: string
) => {
  await wa.presenceSubscribe(jid);
  await delay(500);

  await wa.sendPresenceUpdate("composing", jid);
  await delay(2000);

  await wa.sendPresenceUpdate("paused", jid);

  await wa.sendMessage(jid, msg);
};

export { init, createSession, getSession, deleteSession };
