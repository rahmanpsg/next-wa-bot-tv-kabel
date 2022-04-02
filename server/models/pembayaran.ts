import { Schema, Document, model, Types } from "mongoose";

export interface IPembayaran extends Document {
  user: Types.ObjectId;
  rekening: Types.ObjectId;
  total: number;
  foto: string;
  status: boolean;
  bulan: Array<string>;
}

const schema: Schema = new Schema<IPembayaran>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rekening: {
      type: Schema.Types.ObjectId,
      ref: "Rekening",
    },
    total: Number,
    foto: String,
    status: Boolean,
    bulan: [String],
  },
  { timestamps: true }
);

module.exports = model("Pembayaran", schema);
