// messageController.js
const pool = require("../db");

exports.getUserMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        m.id,
        u.name,
        u.avatar,
        m.content AS lastMessage,
        m.timestamp,
        0 AS unreadCount
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.receiver_id = $1
      ORDER BY m.timestamp DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// 🔥 New function to save a message
exports.sendMessage = async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
      [sender_id, receiver_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
