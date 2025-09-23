const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String },
    link: { type: String },
    relationship: { type: String }, // e.g., girlfriend, boyfriend, partner
    occasion: { type: String },     // e.g., birthday, anniversary
    budget: { type: String },       // optional: for filtering
    hobbies: { type: String },      // optional: hobbies/interests
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gift", giftSchema);
