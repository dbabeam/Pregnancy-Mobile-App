const express = require('express')
const router = express.Router()
const pool = require('../db') // Adjust the path if needed

// ✅ ADD a contact
// ✅ ADD a contact
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, number, description } = req.body;

  console.log('🔍 Received POST:', { userId, body: req.body });

  if (!name || !number || !description) {
    console.log('🚨 Missing fields in POST');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO emergency_contacts (user_id, contact_name, contact_phone, contact_relationship)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, name, number, description]
    );
    console.log('✅ Insert successful:', result.rows[0]);
    res.status(201).json({ message: 'Contact added successfully' });
  } catch (error) {
    console.error('❌ Insert error:', error);
    res.status(500).json({ error: 'Failed to add contact' });
  }
});


// ✅ GET contacts for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    const result = await pool.query(
      'SELECT id, contact_name AS name, contact_phone AS number, contact_relationship AS description FROM emergency_contacts WHERE user_id = $1',
      [userId]
    )
    res.status(200).json({ contacts: result.rows })
  } catch (error) {
    console.error('❌ Failed to fetch contacts:', error)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

// ✅ DELETE a contact
router.delete('/:userId/:contactId', async (req, res) => {
  const { contactId } = req.params

  try {
    await pool.query('DELETE FROM emergency_contacts WHERE id = $1', [contactId])
    res.status(200).json({ message: 'Contact deleted successfully' })
  } catch (error) {
    console.error('❌ Failed to delete contact:', error)
    res.status(500).json({ error: 'Failed to delete contact' })
  }
})

module.exports = router
