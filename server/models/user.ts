import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  nik: number;
  username: string;
  password: string;
  nama: string;
  telpon: string;
  alamat: string;
  role: string;
}

const schema: Schema = new Schema<IUser>(
  {
    nik: {
      type: Number,
      unique: true,
      minlength: 16,
      maxlength: 16,
      required: true,
    },
    username: String,
    password: String,
    nama: String,
    telpon: {
      type: String,
      unique: true,
      required: true,
    },
    alamat: String,
    role: {
      type: String,
      default: "pelanggan",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("User", schema);
