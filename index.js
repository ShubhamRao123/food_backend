const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const restaurantRoutes = require("./routes/restaurant");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const addressRouter = require("./routes/address");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/address", addressRouter);

app.listen(PORT, () => {
  console.log("Server is running on port : 3000");
  mongoose
    .connect(MONGO_URL, {})
    .then(() => {
      console.log("Connected to MongoDb");
    })
    .catch((error) => {
      console.log(error);
    });
});
