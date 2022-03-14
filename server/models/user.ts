import mongoose from "mongoose";

interface User {
    username: string;
    password: string;
    nama: string;
    role: string;
}

const schema = new mongoose.Schema<User>(
    {
        username: String,
        password: String,
        nama: String,
        role: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", schema);
