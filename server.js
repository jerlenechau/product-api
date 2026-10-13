require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware đọc JSON từ request
app.use(express.json());

// Product API
app.use("/api/products", productRoutes);

// Health check
app.get("/health", (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;

  if (!mongoConnected) {
    return res.status(503).json({
      status: "DOWN",
      mongodb: "DISCONNECTED",
    });
  }

  res.status(200).json({
    status: "UP",
    mongodb: "CONNECTED",
  });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB;

mongoose
  .connect(MONGO_URI, {
    dbName: MONGO_DB,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    console.log(`Database: ${mongoose.connection.name}`);

    app.listen(PORT, () => {
      console.log(`Product API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });