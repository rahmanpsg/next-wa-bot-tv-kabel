import { existsSync, mkdirSync, unlinkSync, readdir } from "fs";
import { join } from "path";
import { Boom } from "@hapi/boom";
import makeWASocket, {
	fetchLatestBaileysVersion,
	useSingleFileAuthState,
	makeInMemoryStore,
	DisconnectReason,
	Browsers,
	delay,
	AnyMessageContent,
	proto,
	downloadContentFromMessage,
	DownloadableMessage,
	SocketConfig,
	//   delay,
} from "@adiwajshing/baileys";

import { Response } from "express";
import socketio from "socket.io";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

import UserController from "./controller/user";
import PengaduanController from "./controller/pengaduan";
import PembayaranController from "./controller/pembayaran";
import RekeningController from "./controller/rekening";

import { formatRupiah } from "./utils/stringFormat";

const sessionId = "tv_kabel";
const sessions = new Map();
const retries = new Map();

const chatSession = new Map<string, string>();
const daftarSession = new Map<
	string,
	{ nik: number; nama: string; alamat: string }
>();
const pembayaranSession = new Map<string, number>();

const init = () => {
	if (!existsSync(__dirname + "/sessions")) {
		mkdirSync(__dirname + "/sessions", { recursive: true });
	}

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

	const { state, saveState } = useSingleFileAuthState(sessionsDir());

	const { version } = await fetchLatestBaileysVersion();

	const waConfig: Partial<SocketConfig> = {
		version,
		auth: state,
		printQRInTerminal: false,
		browser: Browsers.ubuntu("Chrome"),
	};

	const wa = makeWASocket(waConfig);

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

			// await wa!.chatRead(msg.key, 1);
			await wa!.sendReadReceipt(msg.key.remoteJid!, msg.key.participant!, [
				msg.key.id!,
			]);

			// fungsi untuk membalas pesan
			const messageContent: AnyMessageContent = await checkPesan(msg);

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
	msg: proto.IWebMessageInfo
): Promise<AnyMessageContent> {
	const message = msg.message!;
	const remoteJid = msg.key.remoteJid!;

	const telpon = remoteJid.split("@")[0];

	// Periksa jika nomor telah terdaftar
	const cekUser = await UserController.cekUser(telpon);

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

	if (cekUser > 0) buttons.splice(0, 1);
	else buttons.splice(-2);

	const messageContent: AnyMessageContent = {
		text: "Halo, saya adalah chat bot TV Kabel. Silahkan pilih layanan yang ingin anda gunakan.",
		footer: "Daftar Layanan",
		buttons: buttons,
	};

	if (chatSession.has(remoteJid)) {
		const messageType = Object.keys(message)[0];

		console.log(messageType);

		// fungsi jika pesan dari tombol
		if (messageType == "messageContextInfo") {
			chatSession.set(
				remoteJid,
				message.buttonsResponseMessage?.selectedButtonId ??
					message.conversation!
			);

			delete messageContent.footer;
			delete messageContent.buttons;

			const buttonId = message.buttonsResponseMessage!.selectedButtonId;
			if (buttonId == "#daftar") {
				messageContent.text =
					"Peraturan PRIMACR TV Kabel.\n 1. Biaya pemasangan baru sebesar 250rb rupiah.\n 2. Biaya iuran perbulan sebesar 25rb rupiah.\n 3. Apabila terjadi penunggakan pembayaran iuran akan dikenakan sanksi denda 5rb/bulan.\n 4. Apabila terjadi penunggakan selama 2 bulan berturut-turut maka diadakan pemutusan sementara tanpa pengembalian biaya penyambungan.\n\nSilahkan masukkan data anda sesuai dengan format berikut untuk melanjutkan pendaftaran. \n\nNama Lengkap#NIK#Alamat Lengkap.\n\nContoh: \nImran#123456789#Jl. Lkr. Lapadde No.2";
				chatSession.set(remoteJid, "#daftar");
			} else if (buttonId == "#daftar_oke") {
				try {
					if (daftarSession.has(remoteJid)) {
						const { nik, nama, alamat } = daftarSession.get(remoteJid)!;

						messageContent.text =
							"Terimakasih telah mendaftar. \nSilahkan tunggu konfirmasi dari admin";

						UserController.save(nik, nama, telpon, alamat);

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
					// {
					// 	buttonId: "#pengaduan_siaran_rusak",
					// 	buttonText: { displayText: "Siaran Rusak" },
					// },
					{
						buttonId: "#pengaduan_lainnya",
						buttonText: { displayText: "Lainnya" },
					},
				];
			} else if (
				[
					"#pengaduan_kabel",
					"#pengaduan_siaran_acak",
					"#pengaduan_siaran_rusak",
				].includes(buttonId!)
			) {
				messageContent.text =
					"Terima kasih telah mengadukan pengaduan. Petugas akan segera menindaklanjuti pengaduan anda.";

				PengaduanController.save(
					telpon,
					message.buttonsResponseMessage!.selectedDisplayText!
				);

				chatSession.delete(remoteJid);
			} else if (buttonId == "#pengaduan_lainnya")
				messageContent.text = "Silahkan masukkan pengaduan anda";
			else if (buttonId == "#pembayaran") {
				try {
					// periksa daftar iuran yang belum dibayar
					await PembayaranController.cekPembayaran(telpon, true);

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
				} catch (error) {
					messageContent.text = "Tidak ada pembayaran yang belum dibayar.";
				}
			} else if (buttonId == "#pembayaran_data") {
				try {
					await PembayaranController.cekPembayaran(telpon);
				} catch (error) {
					messageContent.text = error as string;
				}
			} else if (buttonId == "#pembayaran_iuran") {
				messageContent.text = "Silahkan pilih total bulan yang ingin dibayar";
				const listBulan = [1, 3, 6, 12];
				messageContent.buttons = listBulan.map((bulan) => {
					return {
						buttonId: `#pembayaran_iuran_${bulan}`,
						buttonText: { displayText: `${bulan} Bulan` },
					};
				});
			} else if (buttonId?.match(/#pembayaran_iuran_\d/)) {
				// menyimpan data pembayaran ke session
				const bulan = parseInt(buttonId.replace("#pembayaran_iuran_", ""));

				pembayaranSession.set(remoteJid, bulan);

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
				try {
					const id = buttonId!.replace("#pembayaran_iuran_transfer_", "");
					const rekening = await RekeningController.get(id);

					const totalBulan = pembayaranSession.get(remoteJid);

					// periksa daftar iuran yang belum dibayar
					const arrBulan = await PembayaranController.cekPembayaran(
						telpon,
						true
					);

					const pembayaran = await PembayaranController.getTotalPembayaran(
						totalBulan!,
						arrBulan
					);

					// simpan pembayaran
					PembayaranController.savePembayaran(
						telpon,
						pembayaran.bulans,
						pembayaran.total,
						id
					);

					const strBulan =
						pembayaran.bulans.length > 1
							? `${pembayaran.bulans[0]} - ${
									pembayaran.bulans[pembayaran.bulans.length - 1]
							  }`
							: pembayaran.bulans[0];

					messageContent.text = `Anda akan melakukan pembayaran untuk bulan ${strBulan}. \nSilahkan transfer ke nomor rekening ${
						rekening!.nama
					} : ${rekening!.nomor} dengan total pembayaran ${formatRupiah(
						pembayaran.total
					)}. \nSimpan bukti transfer anda untuk mengkonfirmasi pembayaran. \nTerima kasih.`;
				} catch (error) {
					messageContent.text = error as string;
				}
				chatSession.delete(remoteJid);
			} else if (buttonId == "#pembayaran_iuran_tunai") {
				try {
					const totalBulan = pembayaranSession.get(remoteJid);

					// periksa daftar iuran yang belum dibayar
					const arrBulan = await PembayaranController.cekPembayaran(
						telpon,
						true
					);

					const pembayaran = await PembayaranController.getTotalPembayaran(
						totalBulan!,
						arrBulan
					);

					// simpan pembayaran
					PembayaranController.savePembayaran(
						telpon,
						pembayaran.bulans,
						pembayaran.total
					);

					messageContent.text = `Silahkan membayar ${formatRupiah(
						pembayaran.total
					)} kepada petugas dan upload bukti pembayaran untuk diverifikasi. \nTerima kasih.`;
				} catch (error) {
					messageContent.text = error as string;
				}
				chatSession.delete(remoteJid);
			} else if (buttonId == "#pembayaran_verifikasi") {
				messageContent.text = "Silahkan upload bukti pembayaran anda";
				chatSession.set(remoteJid, "#pembayaran_verifikasi");
			} else {
				messageContent.text = "Maaf, layanan tidak tersedia";
				chatSession.delete(remoteJid);
			}
		}
		// fungsi jika pesan di ketik
		else if (messageType == "conversation") {
			// chatSession.set(
			//   remoteJid,
			//   message.buttonsResponseMessage?.selectedButtonId ??
			//     message.conversation!
			// );

			delete messageContent.footer;
			delete messageContent.buttons;

			console.log(chatSession.get(remoteJid));

			switch (chatSession.get(remoteJid)) {
				case "#daftar":
					{
						try {
							const data = message.conversation!.split("#");
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

					PengaduanController.save(telpon, message.conversation!);

					chatSession.delete(remoteJid);
					break;
				default:
					messageContent.text = "Maaf, layanan tidak tersedia";
					chatSession.delete(remoteJid);
			}
		} else if (messageType === "imageMessage") {
			console.log(chatSession.get(remoteJid));

			if (chatSession.get(remoteJid) == "#pembayaran_verifikasi") {
				try {
					const pembayaran = await PembayaranController.geyByTelpon(telpon);

					const { mediaKey, directPath, url } = msg.message!.imageMessage!;

					const downloadableMessage: DownloadableMessage = {
						mediaKey: mediaKey!,
						directPath: directPath!,
						url: url!,
					};
					const stream = await downloadContentFromMessage(
						downloadableMessage,
						"image"
					);
					let buffer = Buffer.from([]);
					for await (const chunk of stream) {
						buffer = Buffer.concat([buffer, chunk]);
					}
					// simpan ke cloudinary
					const uploadFromBufer = async () => {
						return new Promise((resolve, reject) => {
							const cld_upload_stream = cloudinary.v2.uploader.upload_stream(
								{
									public_id: `pembayaran/${pembayaran._id}}`,
								},
								(error, result: any) => {
									if (error) {
										reject(
											"Terjadi masalah saat mengupload bukti pembayaran. Silahkan coba beberapa saat lagi"
										);
									} else {
										resolve(
											"Bukti pembayaran berhasil diupload.\nTerima kasih."
										);

										PembayaranController.saveBuktiPembayaran(
											pembayaran.id,
											result!.url!
										);

										chatSession.delete(remoteJid);
									}
								}
							);

							streamifier.createReadStream(buffer).pipe(cld_upload_stream);
						});
					};
					const res = await uploadFromBufer();
					messageContent.text = res as string;
				} catch (error) {
					messageContent.text = error as string;
				}

				delete messageContent.footer;
				delete messageContent.buttons;
			}
		}
	} else {
		chatSession.set(
			remoteJid,
			message.buttonsResponseMessage?.selectedButtonId ?? message.conversation!
		);
	}

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
