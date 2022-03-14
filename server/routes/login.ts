import express from "express";
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        userModel.findOne({ username }).exec((err: any, doc: any) => {
            if (err) {
                res.status(500).send({ message: err.message });
                return;
            }

            if (!doc) {
                res
                    .status(404)
                    .send({ error: true, message: "Username tidak ditemukan" });
                return;
            }

            if (password != doc.password) {
                res
                    .status(401)
                    .send({ error: true, message: "Username atau password salah" });
                return;
            }

            const user = doc.toJSON();

            // Create token
            const token = jwt.sign(
                { id: user._id, username },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "7 days",
                }
            );

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
});

module.exports = router;