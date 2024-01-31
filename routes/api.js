"use strict";

const mongoose = require("mongoose");

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

    // Example response structure
    if (Array.isArray(stockSymbols) && stockSymbols.length === 2) {
      // Case: Two stocks passed
      const [stockSymbol1, stockSymbol2] = stockSymbols;

      const stockData1 = {
        stock: stockSymbol1,
        price: 100.0, // Replace with actual stock price
        likes: hasLiked ? 0 : 1, // Increment likes if not already liked
      };

      const stockData2 = {
        stock: stockSymbol2,
        price: 150.0, // Replace with actual stock price
        likes: hasLiked ? 0 : 1, // Increment likes if not already liked
      };

      const rel_likes = stockData1.likes - stockData2.likes;

      res.json({
        stockData: [
          { ...stockData1, rel_likes },
          { ...stockData2, rel_likes: -rel_likes }, // Negative for the second stock
        ],
      });
    } else {
      // Case: One stock passed
      const stockData = {
        stock: stockSymbols,
        price: 100.0, // Replace with actual stock price
        likes: hasLiked ? 0 : 1, // Increment likes if not already liked
      };

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