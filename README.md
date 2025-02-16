# Trade Finder

A project for analyzing and tracking historical cryptocurrency patterns using MongoDB and Coingecko API.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
  - Must be running locally on default port (27017)
  - No authentication required for local development
- npm or yarn

## Features

- Fetches historical token prices from Coingecko API for the last 30 days
- Supports major cryptocurrencies: BTC, ETH, XRP, SOL, ADA, DOGE
- Stores OHLCV (Open, High, Low, Close, Volume) data in MongoDB
- Detects candlestick patterns:
  - Hammer (bullish reversal pattern)
  - Shooting Star (bearish reversal pattern)
- Interactive CLI interface for data management and pattern analysis

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file with the following:

   ```
   COINGECKO_API_KEY=your_coingecko_api_key
   MONGODB_URI=mongodb://localhost:27017/crypto_patterns
   ```

3. **Run the project**:
   ```bash
   npm run dev
   ```

## CLI Usage

The application provides an interactive command-line interface with the following options:

### Main Menu

```
Available commands:
1. fetch - Fetch new data from CoinGecko
2. search - Search for patterns
3. exit - Exit the program
```

You can enter either the number (1,2,3) or the command name.

### Commands

1. **fetch**

   - Fetches last 30 days of OHLCV data for all supported cryptocurrencies
   - Automatically saves to MongoDB
   - Includes rate limiting to respect CoinGecko API limits
   - Shows progress for each symbol

2. **search**

   - Allows searching for specific candlestick patterns
   - Available patterns:
     - `hammer`: Bullish reversal pattern in downtrend
     - `shootingstar`: Bearish reversal pattern in uptrend
   - Displays detailed results including:
     - Symbol
     - Timestamp
     - Price
     - OHLC values
   - Enter 'back' to return to main menu

3. **exit**
   - Safely closes the application

## Database

MongoDB is used to store the historical data:

- **Database**: `crypto_patterns`
- **Collections**:
  - `candles`: Stores OHLCV data
    - Indexed by symbol and timestamp
    - Includes open, high, low, close prices and volume

## Technical Details

- Written in TypeScript
- Uses CoinGecko's REST API with demo account
- Implements pattern detection based on:
  - Price action
  - Trend analysis
  - Shadow/body ratio calculations

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](https://choosealicense.com/licenses/mit/)
