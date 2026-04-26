const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  style: { type: String, default: "neutral" },
  tone: { type: Number, default: 50 },

  chatHistory: [
    {
      role: String,
      content: String
    }
  ]
});

module.exports = mongoose.model("User", userSchema);