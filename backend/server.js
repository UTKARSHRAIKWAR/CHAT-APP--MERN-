const dotenv = require("dotenv");
const express = require("express");

const chats = require("./data/data");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRouter");
const messageRoute = require("./routes/messageRoutes");
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
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server Started on Port ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Connection to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("Chats.user not defined");
  });
});
