export interface OHLCV {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  symbol: string;
}

export interface PatternParams {
  maxBodyToRangeRatio: number; // Default: 0.3 for hammer/shooting star
  maxUpperShadowRatio: number; // Default: 0.1 for hammer, 0.6 for shooting star
  minLowerShadowRatio: number; // Default: 0.6 for hammer, 0.1 for shooting star
  trendPeriod: number; // Default: 14 periods for trend detection
  bodyColorMatter: boolean; // Default: false
}
