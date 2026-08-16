const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const categoryRoutes = require("./routes/categoryRoutes");
const listingRoutes = require("./routes/listingRoutes");
const fieldRoutes = require("./routes/fieldRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/fields", fieldRoutes);

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      message: "Server is running",
      database: "Connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server is running",
      database: "Connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
