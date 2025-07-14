const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const pool = require("./db"); // Ensure this is your pg pool

// Routes
const userRoutes = require("./routes/userRoutes");
const patientRoutes = require("./routes/patientRoutes");
const setupRoutes = require("./routes/setupRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const tipRoutes = require("./routes/tipRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const messageRoutes = require("./routes/messagesRoutes"); // 💬 NEW

const app = express();
const server = http.createServer(app); // 👈 wrap app in http server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow mobile frontend to connect
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/messages", messageRoutes); // 💬 REST route for fetching/saving messages

app.get("/", (req, res) => {
  res.send("🚀 PregCare API is up and running!");
});

// ⚡ SOCKET.IO REAL-TIME MESSAGING
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId.toString());
    console.log(`👥 User ${userId} joined their room`);
  });

  socket.on("send_message", async (data) => {
    const { sender_id, receiver_id, content } = data;

    try {
      // Save to DB
      const result = await pool.query(
        "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
        [sender_id, receiver_id, content]
      );

      const savedMessage = result.rows[0];

      // Send to receiver in their room
      io.to(receiver_id.toString()).emit("receive_message", savedMessage);
      console.log(`📩 Sent message from ${sender_id} to ${receiver_id}`);
    } catch (err) {
      console.error("❌ Message save error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
