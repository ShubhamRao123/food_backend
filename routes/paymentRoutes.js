const express = require("express");
const router = express.Router();
const DebitCard = require("../schema/payment.schema"); // DebitCard model

// Add a new debit card for a user
router.post("/add", async (req, res) => {
  const { userId, cardNumber, expirationDate, cvv, nameOnCard } = req.body;

  // Validate that all required fields are provided
  if (!userId || !cardNumber || !expirationDate || !cvv || !nameOnCard) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newCard = new DebitCard({
      userId,
      cardNumber,
      expirationDate,
      cvv,
      nameOnCard,
    });

    // Save the card in the database
    await newCard.save();
    res
      .status(201)
      .json({ message: "Debit card added successfully", card: newCard });
  } catch (error) {
    console.error("Error adding debit card:", error);
    res.status(500).json({ message: "Failed to add debit card" });
  }
});

// Fetch all debit cards for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cards = await DebitCard.find({ userId });
    if (cards.length === 0) {
      return res
        .status(404)
        .json({ message: "No debit cards found for this user" });
    }
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching debit cards:", error);
    res.status(500).json({ message: "Failed to fetch debit cards" });
  }
});

// Delete a debit card for a user
router.delete("/:cardId", async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await DebitCard.findByIdAndDelete(cardId);
    if (!card) {
      return res.status(404).json({ message: "Debit card not found" });
    }
    res.status(200).json({ message: "Debit card deleted successfully" });
  } catch (error) {
    console.error("Error deleting debit card:", error);
    res.status(500).json({ message: "Failed to delete debit card" });
  }
});

router.put("/update/:cardId", async (req, res) => {
  const { cardId } = req.params;
  const { cardNumber, expirationDate, cvv, nameOnCard } = req.body;

  // Validate that the required fields are provided
  if (!cardNumber || !expirationDate || !cvv || !nameOnCard) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find the debit card by ID
    const card = await DebitCard.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Debit card not found" });
    }

    // Update the card's details
    card.cardNumber = cardNumber;
    card.expirationDate = expirationDate;
    card.cvv = cvv;
    card.nameOnCard = nameOnCard;

    // Save the updated card back to the database
    await card.save();
    res.status(200).json({ message: "Debit card updated successfully", card });
  } catch (error) {
    console.error("Error updating debit card:", error);
    res.status(500).json({ message: "Failed to update debit card" });
  }
});

module.exports = router;
