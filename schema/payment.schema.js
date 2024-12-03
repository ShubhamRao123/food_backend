const mongoose = require("mongoose");

const debitCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User schema
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
    match: /^[0-9]{16}$/, // Match a 16 digit number
  },
  expirationDate: {
    type: String, // Format: MM/YYYY
    required: true,
  },
  cvv: {
    type: String,
    required: true,
    match: /^[0-9]{3}$/, // Match a 3-digit CVV number
  },
  nameOnCard: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("DebitCard", debitCardSchema);
