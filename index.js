// server.js (Main Website Backend with Socket.IO Integration)

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import  connectDB  from "./backend/config/db.js";
import ticketRouter from "./backend/routes/ticketRoute.js"

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
     credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
connectDB();

// Routes
app.use("/api/tickets", ticketRouter);
// ✅ Base Route
app.get("/", (req, res) => {
  res.send("✅ API Working");
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);
  
   socket.on("joinTicket", (ticketId) => {
    console.log(`User with ID ${socket.id} joined ticket room: ${ticketId}`);
    socket.join(ticketId); // Join the room for the specific ticket
  });

  // Listen for user messages
  socket.on("userMessage", (data) => {
    console.log("User Message: ", data);
     io.to(data.ticketId).emit("newUserMessage", data); // Send message to the specific ticket room
  });

  // Listen for agent messages
  socket.on("agentMessage", (data) => {
    console.log("Agent Message: ", data);
    io.to(data.ticketId).emit("newAgentMessage", data); // Send message to the specific ticket room
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
