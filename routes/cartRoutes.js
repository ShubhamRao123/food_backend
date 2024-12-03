const express = require("express");
const Cart = require("../schema/cart.schema");
const crypto = require("crypto"); // For generating unique tokens

const router = express.Router();

// Save or Update Cart
router.post("/save", async (req, res) => {
  const { userId, items, totalPrice } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Update existing cart
      cart.items = items;
      cart.totalPrice = totalPrice;
    } else {
      // Create new cart with userId
      cart = new Cart({ userId, items, totalPrice });
    }

    await cart.save();
    res.status(200).json({ message: "Cart saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save cart!" });
  }
});

// Get Cart by User ID
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Cart not found!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve cart!" });
  }
});

// Generate Shareable Cart Link
router.post("/shared", async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found!" });
    }

    // Generate a unique share token
    const shareToken = crypto.randomBytes(16).toString("hex");
    cart.shareToken = shareToken; // Store the token in the cart document
    await cart.save();

    res.status(200).json({ shareToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate shareable link!" });
  }
});

// Fetch Cart by Share Token
router.get("/shared/:shareToken", async (req, res) => {
  const { shareToken } = req.params;

  try {
    const cart = await Cart.findOne({ shareToken });
    if (!cart) {
      return res.status(404).json({ message: "Shared cart not found!" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch shared cart!" });
  }
});

module.exports = router;
