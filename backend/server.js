const dotenv = require("dotenv");
const express = require("express");

const chats = require("./data/data");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleWare");
const app = express();

dotenv.config();

app.use(cors());

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is runnig");
});

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

// app.get("/api/chats", (req, res) => {
//   res.send(chats);
// });

// app.get("/api/chats", (req, res) => {
//   res.json([
//     { message: "Hello from backend!" },
//     { message: "Chat system online." },
//   ]);
// });

const PORT = process.env.PORT || 5000;

// app.get("
//
// /api/chats/:id", (req, res) => {
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   res.send(singleChat);
// });

// app.get("/api/chats/:id", (req, res) => {
//   const singleChat = chats.find((c) => c._id === req.params.id);

//   if (!singleChat) {
//     return res.status(404).json({ message: "Chat not found" });
//   }

//   res.send(singleChat);
// });

app.listen(PORT, console.log(`Server Started on Port ${PORT}`));
