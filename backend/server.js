const express = require("express");

const dotenv = require("dotenv");
dotenv.config(); // LOADS ENV vairables and  process.env gets user env variables 

const mailsender = require("./config/email-config")
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { ErrorMiddleware } = require("./middlewares");
const path = require("path");

connectDB();
const app = express();

app.use(express.json()); // to accept json data


app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);



// Error Handling middlewares
app.use(ErrorMiddleware.notFound);
app.use(ErrorMiddleware.errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  ()=>{
    console.log(`Server running on PORT ${PORT}...`)
  }
);
let count = 0 ;
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io" , count++);
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
