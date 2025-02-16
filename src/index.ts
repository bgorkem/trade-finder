import { connectDB, getCandles } from "./services/db.service";
import { isHammer, isShootingStar } from "./utils/pattern-detection";
import { OHLCV, PatternParams } from "./types";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const SUPPORTED_PATTERNS = ["hammer", "shootingstar"] as const;
type PatternType = (typeof SUPPORTED_PATTERNS)[number];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> =>
  new Promise((resolve) => rl.question(query, resolve));

async function findPatternsInDb(
  pattern: PatternType,
  params: Partial<PatternParams> = {}
) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30); // Last 30 days

  const symbols = ["BTC", "ETH", "XRP", "SOL", "ADA", "DOGE"];
  const results = [];

  for (const symbol of symbols) {
    const candles = await getCandles(symbol, fromDate, new Date());

    // Need at least trendPeriod + 1 candles for pattern detection
    for (let i = 14; i < candles.length; i++) {
      const currentCandle = candles[i];
      const prevCandles = candles.slice(i - 14, i);

      let isPattern = false;
      if (pattern === "hammer") {
        isPattern = isHammer(currentCandle, prevCandles, params);
      } else if (pattern === "shootingstar") {
        isPattern = isShootingStar(currentCandle, prevCandles, params);
      }

      if (isPattern) {
        results.push({
          type: pattern,
          symbol,
          timestamp: currentCandle.timestamp,
          price: currentCandle.close,
          open: currentCandle.open,
          high: currentCandle.high,
          low: currentCandle.low,
        });
      }
    }
  }

  return results;
}

async function main() {
  try {
    await connectDB();

    while (true) {
      console.log("\nAvailable patterns:", SUPPORTED_PATTERNS.join(", "));
      const pattern = (
        await question("Enter pattern to search for (or 'exit' to quit): ")
      ).toLowerCase();

      if (pattern === "exit") {
        break;
      }

      if (!SUPPORTED_PATTERNS.includes(pattern as PatternType)) {
        console.log("Invalid pattern. Please try again.");
        continue;
      }

      console.log(`\nSearching for ${pattern} patterns...`);
      const results = await findPatternsInDb(pattern as PatternType);

      if (results.length === 0) {
        console.log("No patterns found.");
      } else {
        console.log(`\nFound ${results.length} ${pattern} patterns:`);
        results.forEach((result) => {
          console.log(`
Symbol: ${result.symbol}
Time: ${result.timestamp.toISOString()}
Price: ${result.price}
OHLC: ${result.open}/${result.high}/${result.low}/${result.price}
-------------------`);
        });
      }
    }

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
