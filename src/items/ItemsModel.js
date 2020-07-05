const mongoose = require("mongoose");

const ItemsSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
    urgent: Boolean,
    important: Boolean,
    targetDate: Date
});

module.exports = mongoose.model("items", ItemsSchema);
