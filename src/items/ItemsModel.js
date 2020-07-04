const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ItemsSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
    urgent: Boolean,
    important: Boolean,
    targetDate: Date
});

module.exports = mongoose.model("items", ItemsSchema);
