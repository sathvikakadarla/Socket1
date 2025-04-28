// server.js (Main Website Backend with Socket.IO Integration)

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./config/db.js";
import ticketRouter from "./routes/ticketRoute.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
connectDB();

// Routes
app.use("/api/tickets", ticketRouter);

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  // Listen for user messages
  socket.on("userMessage", (data) => {
    console.log("User Message: ", data);
    io.emit("newUserMessage", data); // Broadcast to all clients
  });

  // Listen for agent messages
  socket.on("agentMessage", (data) => {
    console.log("Agent Message: ", data);
    io.emit("newAgentMessage", data); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
