import { Schema, Document, model } from "mongoose";

export interface IPembayaran extends Document {
  user: Schema.Types.ObjectId;
  foto: string;
  status: boolean;
  bulan: Array<number>;
}

const schema: Schema = new Schema<IPembayaran>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foto: String,
    status: Boolean,
    bulan: [Number],
  },
  { timestamps: true }
);

module.exports = model("Pembayaran", schema);
