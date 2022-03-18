import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  nik: number;
  username: string;
  password: string;
  nama: string;
  telpon: number;
  alamat: string;
  role: string;
}

const schema: Schema = new Schema<IUser>(
  {
    nik: Number,
    username: String,
    password: String,
    nama: String,
    telpon: Number,
    alamat: String,
    role: String,
  },
  { timestamps: true }
);

module.exports = model("User", schema);
