const db = require('../db'); // DB connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


// ============================
// Register User (Pregnant Woman)
// ============================
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, dob } = req.body;

  if (!firstName || !lastName || !email || !password || !dob) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (first_name, last_name, email, password, role, dob)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, first_name, last_name, email, role, dob`,
      [firstName, lastName, email, hashedPassword, 'pregnant_woman', dob]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ============================
// Login User - with JWT token
// ============================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if pregnancy profile exists
    const profileCheck = await db.query('SELECT * FROM pregnancy_profiles WHERE user_id = $1', [user.id]);
    const profileCompleted = profileCheck.rows.length > 0;

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, first_name: user.first_name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        dob: user.dob,
        role: user.role,
        profileCompleted,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// ============================
// Save Pregnancy Profile - use user ID from token
// ============================
exports.savePatientProfile = async (req, res) => {
  const { lastMenstrualPeriod, firstPregnancy, healthConditions, otherCondition } = req.body;
  const userId = req.user.id;  // user id from JWT token

  if (!lastMenstrualPeriod || firstPregnancy == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await db.query(
      `INSERT INTO pregnancy_profiles 
        (user_id, last_menstrual_period, first_pregnancy, health_conditions, other_condition)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, lastMenstrualPeriod, firstPregnancy, JSON.stringify(healthConditions), otherCondition]
    );

    res.status(201).json({ profile: result.rows[0] });
  } catch (err) {
    console.error('Error saving profile:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// ============================
// Check Pregnancy Setup Completion - use user ID from token
// ============================
// Add this to the existing userController.js

// Check if pregnancy profile is completed
exports.checkPregnancySetup = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM pregnancy_profiles WHERE user_id = $1',
      [req.user.id]
    );
    
    res.json({
      profileCompleted: result.rows.length > 0,
      profile: result.rows[0] || null
    });
  } catch (error) {
    console.error('Error checking pregnancy setup:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userResult = await db.query(
      'SELECT id, first_name, last_name, email, role, dob FROM users WHERE id = $1',
      [req.user.id]
    );

    const pregnancyResult = await db.query(
      'SELECT * FROM pregnancy_profiles WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      user: userResult.rows[0],
      pregnancyProfile: pregnancyResult.rows[0] || null
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
