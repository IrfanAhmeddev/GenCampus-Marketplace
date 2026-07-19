const express = require("express");
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "https://gencampus.netlify.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1", routes);

// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "GenCampus Marketplace Backend Running 🚀"
    });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;