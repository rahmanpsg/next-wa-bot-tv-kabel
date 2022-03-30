import { Schema, Document, model } from "mongoose";

export interface IPengaduan extends Document {
  user: Schema.Types.ObjectId;
  pengaduan: string;
}

const schema: Schema = new Schema<IPengaduan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pengaduan: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Pengaduan", schema);
