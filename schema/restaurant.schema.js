const mongoose = require("mongoose");

const foodCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  foodItems: [
    {
      name: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  restaurantImageUrl: {
    type: String,
    required: true,
  },
  foodCategories: [foodCategorySchema],
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
