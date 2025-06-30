// controllers/tipController.js
const pool = require('../db');

const getTipsByTrimester = async (req, res) => {
  try {
    const { trimester, day, category } = req.query;

    let query = 'SELECT * FROM tips WHERE 1=1';
    let values = [];

    if (trimester) {
      values.push(trimester);
      query += ` AND trimester = $${values.length}`;
    }

    if (day) {
      values.push(day);
      query += ` AND show_on_day = $${values.length}`;
    }

    if (category) {
      values.push(category);
      query += ` AND category = $${values.length}`;
    }

    query += ' ORDER BY show_on_day ASC NULLS LAST, created_at DESC';

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tips:', error);
    res.status(500).json({ message: 'Failed to fetch tips' });
  }
};

module.exports = { getTipsByTrimester };
