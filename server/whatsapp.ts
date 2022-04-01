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

import UserController from "./controller/user";
import PengaduanController from "./controller/pengaduan";
import PembayaranController from "./controller/pembayaran";
import RekeningController from "./controller/rekening";

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
  const cekUser = await UserController.cekUser(telpon);

  if (cekUser > 0) buttons.splice(0, 1);
  else buttons.splice(-2);

  const messageContent: AnyMessageContent = {
    text: "Halo, saya adalah chat bot TV Kabel. Silahkan pilih layanan yang ingin anda gunakan.",
    footer: "Daftar Layanan",
    buttons: buttons,
  };

  if (chatSession.has(remoteJid)) {
    delete messageContent.footer;
    delete messageContent.buttons;

    // fungsi jika pesan dari tombol
    if (message.buttonsResponseMessage != null) {
      const buttonId = message.buttonsResponseMessage.selectedButtonId;
      if (buttonId == "#daftar") {
        messageContent.text =
          "Peraturan PRIMACR TV Kabel.\n 1. Biaya pemasangan baru sebesar 250rb rupiah.\n 2. Biaya iuran perbulan sebesar 25rb rupiah.\n 3. Apabila terjadi penunggakan pembayaran iuran akan dikenakan sanksi denda 5rb/bulan.\n 4. Apabila terjadi penunggakan selama 2 bulan berturut-turut maka diadakan pemutusan sementara tanpa pengembalian biasa penyambungan.\n\nSilahkan masukkan data anda sesuai dengan format berikut untuk melanjutkan pendaftara";
      } else if (buttonId == "#daftar_oke") {
        try {
          if (daftarSession.has(remoteJid)) {
            const { nik, nama, alamat } = daftarSession.get(remoteJid)!;

            messageContent.text =
              "Terimakasih telah mendaftar. \nSilahkan tunggu konfirmasi dari admin";

            UserController.save(nik, nama, alamat, telpon);

            chatSession.delete(remoteJid);
          }
        } catch (error) {
          console.log(error);
          messageContent.text = error as string;
        }
      } else if (buttonId == "#pengaduan") {
        messageContent.text = "Silahkan pilih jenis pengaduan";

        messageContent.buttons = [
          {
            buttonId: "#pengaduan_kabel",
            buttonText: { displayText: "Kabel Putus" },
          },
          {
            buttonId: "#pengaduan_siaran_acak",
            buttonText: { displayText: "Siaran Teracak" },
          },
          {
            buttonId: "#pengaduan_siaran_rusak",
            buttonText: { displayText: "Siaran Rusak" },
          },
          {
            buttonId: "#pengaduan_lainnya",
            buttonText: { displayText: "Lainnya" },
          },
        ];
      } else if (
        buttonId ==
        ("#pengaduan_kabel" ||
          "#pengaduan_siaran_acak" ||
          "#pengaduan_siaran_rusak")
      ) {
        messageContent.text =
          "Terima kasih telah mengadukan pengaduan. Petugas akan segera menindaklanjuti pengaduan anda.";

        PengaduanController.save(
          telpon,
          message.buttonsResponseMessage.selectedDisplayText!
        );
      } else if (buttonId == "#pengaduan_lainnya")
        messageContent.text = "Silahkan masukkan pengaduan anda";
      else if (buttonId == "#pembayaran") {
        messageContent.text = "Silahkan pilih layanan berikut";
        messageContent.buttons = [
          {
            buttonId: "#pembayaran_data",
            buttonText: { displayText: "Data Pembayaran" },
          },
          {
            buttonId: "#pembayaran_iuran",
            buttonText: { displayText: "Pembayaran Iuran" },
          },
          {
            buttonId: "#pembayaran_verifikasi",
            buttonText: { displayText: "Verifikasi Pembayaran" },
          },
        ];
      } else if (buttonId == "#pembayaran_data") {
        try {
          await PembayaranController.cekPembayaran(telpon);
        } catch (error) {
          messageContent.text = error as string;
        }
      } else if (buttonId == "#pembayaran_iuran") {
        messageContent.text = "Silahkan pilih metode pembayaran";
        messageContent.buttons = [
          {
            buttonId: "#pembayaran_iuran_tunai",
            buttonText: { displayText: "Tunai" },
          },
          {
            buttonId: "#pembayaran_iuran_transfer",
            buttonText: { displayText: "Transfer" },
          },
          {
            buttonId: "#pembayaran_iuran",
            buttonText: { displayText: "Verifikasi Pembayaran" },
          },
        ];
      } else if (buttonId == "#pembayaran_iuran_transfer") {
        try {
          const rekenings = await RekeningController.getAll();

          messageContent.text = "Silahkan pilih rekening pembayaran";
          messageContent.buttons = rekenings!.map((rekening) => {
            return {
              buttonId: `#pembayaran_iuran_transfer_${rekening.id}`,
              buttonText: { displayText: rekening.nama },
            };
          });
        } catch (error) {
          messageContent.text = error as string;
        }
      } else if (buttonId!.match(/#pembayaran_iuran_transfer_/)) {
        const id = buttonId?.split("_")[3];

        const rekening = await RekeningController.get(id!);

        messageContent.text = `Nomor Rekening : ${rekening!.nomor}`;
      } else {
        messageContent.text = "Maaf, layanan tidak tersedia";
      }
    }
    // fungsi jika pesan di ketik
    else if (message.conversation != null)
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
        case "#pengaduan_lainnya":
          messageContent.text =
            "Terima kasih telah mengadukan pengaduan. Petugas akan segera menindaklanjuti pengaduan anda.";

          PengaduanController.save(telpon, message.conversation);
          break;
        default:
          messageContent.text = "Maaf, layanan tidak tersedia";
      }
  }

  chatSession.set(
    remoteJid,
    message.buttonsResponseMessage?.selectedButtonId ?? message.conversation!
  );

  console.log(chatSession);

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
