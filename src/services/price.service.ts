import { OHLCV } from "../types";

const SUPPORTED_SYMBOLS = ["BTC", "ETH", "XRP", "SOL", "ADA", "DOGE"];
const COINGECKO_IDS: { [key: string]: string } = {
  BTC: "bitcoin",
  ETH: "ethereum",
  XRP: "ripple",
  SOL: "solana",
  ADA: "cardano",
  DOGE: "dogecoin",
};

export const fetchHistoricalData = async (
  symbol: string,
  from: Date,
  to: Date
): Promise<OHLCV[]> => {
  if (!SUPPORTED_SYMBOLS.includes(symbol)) {
    throw new Error(`Unsupported symbol: ${symbol}`);
  }

  // Add delay to respect rate limits
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${COINGECKO_IDS[symbol]}/ohlc?` +
        new URLSearchParams({
          vs_currency: "usd",
          days: "30", // Reduced to 30 days
        }),
      {
        headers: {
          Accept: "application/json",
          "x-cg-demo-api-key": "CG-6gdRbmo7BDGM7iEK9B39J6AW",
        },
      }
    );

    if (response.status === 429) {
      console.log("Rate limit hit, waiting 60 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 61000));
      return fetchHistoricalData(symbol, from, to); // Retry
    }

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data = (await response.json()) as number[][];
    console.log(`Fetched ${data.length} candles for ${symbol}`);
    return transformCoinGeckoData(data, symbol);
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    throw error;
  }
};

const transformCoinGeckoData = (data: number[][], symbol: string): OHLCV[] => {
  return data.map((item) => ({
    timestamp: new Date(item[0]), // timestamp
    open: item[1], // open
    high: item[2], // high
    low: item[3], // low
    close: item[4], // close
    volume: 0, // CoinGecko OHLC endpoint doesn't provide volume
    symbol,
  }));
};
