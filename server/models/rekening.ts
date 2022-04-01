import { Schema, Document, model } from "mongoose";

export interface IRekening extends Document {
  nama: string;
  nomor: number;
}

const schema: Schema = new Schema<IRekening>(
  {
    nama: { type: String, unique: true, require: true },
    nomor: {
      type: Number,
      unique: true,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Rekening", schema);
