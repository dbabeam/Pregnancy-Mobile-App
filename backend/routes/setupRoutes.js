const express = require('express');
const router = express.Router();
const db = require('../db'); // your database connection

router.post('/', async (req, res) => {
  try {
    const { userId, lastMenstrualPeriod, firstPregnancy, healthConditions, otherCondition } = req.body;

    if (!userId || !lastMenstrualPeriod || firstPregnancy === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const healthConditionsStr = JSON.stringify(healthConditions || []);

    const query = `
      INSERT INTO pregnancy_setup (user_id, lmp, first_pregnancy, health_conditions, other_condition)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id)
      DO UPDATE SET lmp = EXCLUDED.lmp, first_pregnancy = EXCLUDED.first_pregnancy,
                    health_conditions = EXCLUDED.health_conditions, other_condition = EXCLUDED.other_condition
      RETURNING *;
    `;

    const values = [userId, lastMenstrualPeriod, firstPregnancy, healthConditionsStr, otherCondition || ''];

    const result = await db.query(query, values);

    res.json({ message: 'Setup saved', setup: result.rows[0] });
  } catch (error) {
    console.error('Error saving setup:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
