# Crypto Patterns

A project for analyzing and tracking cryptocurrency patterns using MongoDB and Coingecko API.

## Features

- Fetch historical token prices from Coingecko API
- Store and query candle data in MongoDB
- Analyze crypto patterns (hammer, shootingstar) using technical indicators

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
   npm start
   ```

## Database

- **MongoDB**: Data is stored in the `crypto_patterns` database.
  - Collections: `candles`, `patterns`

## API Usage

- Fetch token prices:
  ```typescript
  const prices = await getTokenPrices(
    "ETH",
    new Date("2023-01-01"),
    new Date("2023-01-31")
  );
  ```

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](https://choosealicense.com/licenses/mit/)
