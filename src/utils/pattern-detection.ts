import { OHLCV, PatternParams } from "../types";

const DEFAULT_PARAMS: PatternParams = {
  maxBodyToRangeRatio: 0.3,
  maxUpperShadowRatio: 0.1,
  minLowerShadowRatio: 0.6,
  trendPeriod: 14,
  bodyColorMatter: false,
};

export const detectTrend = (
  candles: OHLCV[],
  period: number = 14
): "up" | "down" => {
  const prices = candles.slice(-period).map((c) => c.close);
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];

  // Simple trend detection using first and last price
  // Could be enhanced with moving averages or other indicators
  return lastPrice > firstPrice ? "up" : "down";
};

export const isHammer = (
  candle: OHLCV,
  prevCandles: OHLCV[],
  params: Partial<PatternParams> = {}
): boolean => {
  const finalParams = { ...DEFAULT_PARAMS, ...params };
  const trend = detectTrend(prevCandles, finalParams.trendPeriod);

  // Only valid in downtrend
  if (trend !== "down") return false;

  const { bodySize, upperShadow, lowerShadow, totalRange } =
    getCandleMeasurements(candle);

  // Check body to range ratio
  if (bodySize / totalRange > finalParams.maxBodyToRangeRatio) return false;

  // Check shadow ratios
  if (upperShadow / totalRange > finalParams.maxUpperShadowRatio) return false;
  if (lowerShadow / totalRange < finalParams.minLowerShadowRatio) return false;

  // Check body color if it matters
  if (finalParams.bodyColorMatter && candle.close < candle.open) return false;

  return true;
};

export const isShootingStar = (
  candle: OHLCV,
  prevCandles: OHLCV[],
  params: Partial<PatternParams> = {}
): boolean => {
  const starParams = {
    ...DEFAULT_PARAMS,
    maxUpperShadowRatio: 0.6,
    minLowerShadowRatio: 0.1,
    ...params,
  };

  const trend = detectTrend(prevCandles, starParams.trendPeriod);

  // Only valid in uptrend
  if (trend !== "up") return false;

  const { bodySize, upperShadow, lowerShadow, totalRange } =
    getCandleMeasurements(candle);

  // Check body to range ratio
  if (bodySize / totalRange > starParams.maxBodyToRangeRatio) return false;

  // Check shadow ratios
  if (upperShadow / totalRange < starParams.maxUpperShadowRatio) return false;
  if (lowerShadow / totalRange > starParams.minLowerShadowRatio) return false;

  // Check body color if it matters
  if (starParams.bodyColorMatter && candle.close > candle.open) return false;

  return true;
};

const getCandleMeasurements = (candle: OHLCV) => {
  const bodySize = Math.abs(candle.close - candle.open);
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  const totalRange = candle.high - candle.low;

  return { bodySize, upperShadow, lowerShadow, totalRange };
};
