import mongoose from "mongoose";
import { CandleModel } from "../models/candle.model";
import { OHLCV } from "../types";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const saveCandles = async (candles: OHLCV[]): Promise<void> => {
  try {
    await CandleModel.insertMany(candles, { ordered: false });
  } catch (error: any) {
    // Ignore duplicate key errors
    if (!error.writeErrors?.every((e: any) => e.code === 11000)) {
      throw error;
    }
  }
};

export const getCandles = async (
  symbol: string,
  from: Date,
  to: Date
): Promise<OHLCV[]> => {
  return CandleModel.find({
    symbol,
    timestamp: { $gte: from, $lte: to },
  }).sort({ timestamp: 1 });
};
