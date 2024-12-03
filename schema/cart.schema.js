const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: String, // User ID to identify the cart
    required: true,
  },
  items: [
    {
      uniqueKey: { type: String, required: true },
      name: { type: String, required: true },
      category: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  shareToken: { type: String },
});

module.exports = mongoose.model("Cart", cartItemSchema);
