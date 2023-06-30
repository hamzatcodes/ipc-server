const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// Defining path to enviroment variable
dotenv.config();
const app = require(`${__dirname}/app`);

// Handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! Shutting down!");
    console.log("uncaughtException", err.name, err.message);
    process.exit(1);
});

const db = process.env.DB_URL;

// Connecting to Database
mongoose.connect(db).then(() => {
    console.log("DB connection successful");
});

// Listening to port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`app running on port ${port}`);
});

// Handling unhandled rejection
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! Shutting down!");
    console.log("unhandledRejection", err.name, err.message);
    server.close(() => process.exit(1));
});
