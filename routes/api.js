"use strict";

const mongoose = require("mongoose");
const axios = require("axios");

// Define MongoDB schema and model for IP addresses
const ipSchema = new mongoose.Schema({
  address: String,
});

const Ip = mongoose.model("Ip", ipSchema);

module.exports = function (app) {
  app.route("/api/stock-prices").get(async function (req, res) {
    const stockSymbols = req.query.stock;
    const like = req.query.like || false;
    const ip = req.ip; // Express automatically retrieves the IP address

    // Anonymize IP address (you can customize this further based on your needs)
    const anonymizedIp = hashIpAddress(ip);

    // Check if IP already liked the stock
    const hasLiked = await Ip.exists({ address: anonymizedIp });

    // Process stockSymbols and like parameter as needed
    if (!stockSymbols) {
      return res.status(400).json({ error: "Stock symbol is required" });
    }

    // Helper function to get stock data from the FreeCodeCamp Stock Price Checker Proxy
    const getStockData = async (symbol) => {
      try {
        const apiUrl = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;
        const response = await axios.get(apiUrl);

        // Extract relevant stock data
        const price = response.data.latestPrice;
        const likes = hasLiked ? 0 : 1; // Increment likes if not already liked

        return { price, likes };
      } catch (error) {
        console.error("Error fetching stock data:", error.message);
        throw error;
      }
    };

    // Process stockSymbols and like parameter as needed
    if (Array.isArray(stockSymbols)) {
      if (stockSymbols.length === 1) {
        // Case: One stock passed
        const stockSymbol = stockSymbols[0];

        // Get stock data from an external API (e.g., Alpha Vantage)
        const stockData = await getStockData(stockSymbol);

        res.json({
          stockData,
        });
      } else if (stockSymbols.length === 2) {
        // Case: Two stocks passed
        const [stockSymbol1, stockSymbol2] = stockSymbols;

        // Get stock data for the first symbol
        const stockData1 = await getStockData(stockSymbol1);

        // Get stock data for the second symbol
        const stockData2 = await getStockData(stockSymbol2);

        const rel_likes = stockData1.likes - stockData2.likes;

        res.json({
          stockData: [
            { ...stockData1, rel_likes },
            { ...stockData2, rel_likes: -rel_likes }, // Negative for the second stock
          ],
        });
      } else {
        return res
          .status(400)
          .json({ error: "Invalid number of stock symbols" });
      }
    } else {
      // Case: Single stock symbol passed
      const stockSymbol = stockSymbols;

      // Get stock data from an external API (e.g., Alpha Vantage)
      const stockData = await getStockData(stockSymbol);

      res.json({
        stockData,
      });
    }

    // Save anonymized IP to the database if like is true and not already liked
    if (like && !hasLiked) {
      await Ip.create({ address: anonymizedIp });
    }
  });

  // Helper function to hash IP address (you can customize this further)
  function hashIpAddress(ip) {
    // Implement your hashing logic
    return ip; // Placeholder, replace with actual hashing
  }
};
