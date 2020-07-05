const express = require("express");
const app = express();

// express middleware
const morgan = require("morgan");
const bodyParser = require("body-parser");
const errorhandler = require("errorhandler");
const cors = require("cors");

// read config
const PORT = process.env.PORT || 4001;
const BASE_PATH = process.env.BASE_PATH || "/api";
const DB_URL = process.env.DB_URL;

//MongoDB
const mongoose = require("mongoose");
mongoose.connect(DB_URL);
mongoose.Promise = global.Promise; // Get Mongoose to use the global promise library
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));

// init middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

// routes
const itemsRouter = require("./items/itemsRouter.js");
app.use(BASE_PATH + "/items", itemsRouter);

// errorhandler
if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler());
} else {
    app.use((err) => {
        console.log(err);
    });
}

// start server
app.listen(PORT, () => {
    console.log(`Running DoIt2DayServer on ${PORT}`);
});

module.exports = app;
