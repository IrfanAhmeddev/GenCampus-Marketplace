require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {

    console.log(`🚀 GenCampus Backend running on port ${PORT}`);

});

// Handle unexpected promise errors

process.on("unhandledRejection", (err) => {

    console.error(err);

    server.close(() => process.exit(1));

});