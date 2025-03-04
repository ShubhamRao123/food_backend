const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Use String instead of ObjectId
  phoneNumber: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
});

module.exports = mongoose.model("Address", addressSchema);
