const pool = require('../db');

// Get all contacts for a user
exports.getContacts = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

// Add a contact
exports.addContact = async (req, res) => {
  try {
    const { userId } = req.params;
    const { contact_name, contact_phone, contact_relationship } = req.body;
    const result = await pool.query(
      `INSERT INTO emergency_contacts (user_id, contact_name, contact_phone, contact_relationship)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, contact_name, contact_phone, contact_relationship]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add contact' });
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    await pool.query('DELETE FROM emergency_contacts WHERE id = $1', [contactId]);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};

// Optional: Update a contact
exports.updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { contact_name, contact_phone, contact_relationship } = req.body;
    const result = await pool.query(
      `UPDATE emergency_contacts 
       SET contact_name = $1, contact_phone = $2, contact_relationship = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [contact_name, contact_phone, contact_relationship, contactId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
};
