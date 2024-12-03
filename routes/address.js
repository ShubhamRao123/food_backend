const express = require("express");
const router = express.Router();
const Address = require("../schema/address.schema");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    // Assuming decoded payload contains 'userId'
    req.userId = decoded.userId || decoded._id || decoded.email; // Update based on actual token payload structure
    if (!req.userId)
      return res.status(400).json({ message: "User ID missing in token" });
    next();
  });
};

router.post("/add", verifyToken, async (req, res) => {
  try {
    const {
      username,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
    } = req.body;

    // Validate all required fields
    if (
      // !username ||
      !phoneNumber ||
      !addressLine1 ||
      !city ||
      !state ||
      !zipCode ||
      !country
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const address = new Address({
      userId: req.userId,
      phoneNumber,
      addressLine1,
      addressLine2: addressLine2 || "", // Optional
      city,
      state,
      zipCode,
      country,
    });

    const savedAddress = await address.save();
    res
      .status(201)
      .json({ message: "Address added successfully", address: savedAddress });
  } catch (error) {
    console.error("Error adding address:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update an existing address by ID
router.put("/edit/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const address = await Address.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true }
    );

    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found or not authorized" });
    }

    res.status(200).json({ message: "Address updated successfully", address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an address by ID
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found or not authorized" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId });
    res.status(200).json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid address ID format" });
    }

    const address = await Address.findOne({ _id: id, userId: req.userId });
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found or not authorized" });
    }

    res.status(200).json({ message: "Address fetched successfully", address });
  } catch (error) {
    console.error("Error fetching address by ID:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
