const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hobbies: [String],
  budget: String,
  recommendations: [
    {
      item: String,
      price: String,
      description: String,
      link: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GiftHistory", giftSchema);
