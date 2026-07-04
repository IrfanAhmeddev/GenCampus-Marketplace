const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();

// ================================
// Middleware
// ================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ================================
// Routes
// ================================

app.use("/api/v1", routes);

// ================================
// Health Check
// ================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "GenCampus Marketplace Backend Running 🚀"

    });

});

module.exports = app;