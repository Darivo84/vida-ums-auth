const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const { MONGOURI } = require("./keys");

// MongoDB Connection
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to DB!!!");
});
mongoose.connection.on("error", () => {
  console.log("err connecting", err);
});

// Registered Schema
require("./models/user");

app.use(express.json());
app.use(require("./routes/auth"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
