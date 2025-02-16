import mongoose from "mongoose";
import { OHLCV } from "../types";

const candleSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
  volume: { type: Number, required: true },
  symbol: { type: String, required: true },
});

candleSchema.index({ symbol: 1, timestamp: 1 }, { unique: true });

export const CandleModel = mongoose.model<OHLCV & mongoose.Document>(
  "Candle",
  candleSchema
);
