const pool = require("../db"); // Adjust if your DB connection is elsewhere

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
        0 AS unreadCount -- Replace with real unread count logic if needed
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