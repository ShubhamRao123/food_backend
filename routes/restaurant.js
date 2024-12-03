const express = require("express");
const router = express.Router();
const Restaurant = require("../schema/restaurant.schema"); // Adjust the path if necessary

// Route to fetch all restaurants data
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find(); // Fetch all restaurants
    res.status(200).json(restaurants); // Send the data as response
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err });
  }
});

router.post("/restaurants", async (req, res) => {
  const { name, restaurantImageUrl, foodCategories } = req.body;

  // Validate input
  if (
    !name ||
    !restaurantImageUrl ||
    !Array.isArray(foodCategories) ||
    foodCategories.length === 0
  ) {
    return res.status(400).json({
      message:
        "All fields are required and foodCategories should be a non-empty array.",
    });
  }

  // Check if each category contains required fields
  for (const category of foodCategories) {
    if (!category.categoryName || !Array.isArray(category.foodItems)) {
      return res.status(400).json({
        message:
          "Each category must have a categoryName and foodItems should be an array.",
      });
    }
    // Check each food item in the category
    for (const foodItem of category.foodItems) {
      if (
        !foodItem.name ||
        !foodItem.imageUrl ||
        !foodItem.price ||
        !foodItem.description
      ) {
        return res.status(400).json({
          message:
            "Each food item must have name, imageUrl, price, and description.",
        });
      }
    }
  }

  // Create new restaurant object
  const newRestaurant = new Restaurant({
    name,
    restaurantImageUrl,
    foodCategories,
  });

  try {
    const savedRestaurant = await newRestaurant.save(); // Save the new restaurant data
    res.status(201).json(savedRestaurant); // Send the saved restaurant data as response
  } catch (err) {
    res.status(500).json({ message: "Error saving restaurant", error: err });
  }
});

router.get("/restaurant/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id); // Find restaurant by ID
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant); // Send the restaurant data as response
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurant", error: err });
  }
});

// Route to search for food items by name
router.get("/restaurants/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required." });
  }

  try {
    const restaurants = await Restaurant.find({
      "foodCategories.foodItems.name": { $regex: query, $options: "i" }, // Case-insensitive match
    });

    // Filter the results to only include matching food items
    const filteredResults = restaurants.map((restaurant) => {
      const filteredCategories = restaurant.foodCategories.map((category) => ({
        ...category._doc, // Use _doc to access raw Mongoose document
        foodItems: category.foodItems.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        ),
      }));

      // Only include categories with matching food items
      return {
        ...restaurant._doc,
        foodCategories: filteredCategories.filter(
          (category) => category.foodItems.length > 0
        ),
      };
    });

    // Filter out restaurants with no matching categories
    const finalResults = filteredResults.filter(
      (restaurant) => restaurant.foodCategories.length > 0
    );

    res.status(200).json(finalResults);
  } catch (err) {
    res.status(500).json({
      message: "Error searching for food items",
      error: err.message,
    });
  }
});

module.exports = router;
