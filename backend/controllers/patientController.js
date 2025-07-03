// backend/controllers/patientController.js

const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;

// SIGNUP
exports.registeruser = async (req, res) => {
  const { first_name, last_name, email, password, dob } = req.body;

  console.log("Incoming signup data:", { first_name, last_name, email, dob });

  if (!first_name || !last_name || !email || !password || !dob) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ error: "All fields are required" });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    console.log("🔍 Checking if user exists...");
    const existingUser = await pool.query(
      "SELECT * FROM patients WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      console.log("❌ Email already exists");
      return res.status(400).json({ error: "Email already exists" });
    }

    console.log("🔒 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("📥 Inserting user into database...");
    const result = await pool.query(
      `INSERT INTO patients 
        (first_name, last_name, email, password, dob, profile_completed) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, profile_completed`,
      [first_name, last_name, normalizedEmail, hashedPassword, dob, false]
    );

    const user = result.rows[0];
    console.log("✅ User inserted:", user);

    console.log("🔑 Generating token...");
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Signup success, sending response...");
    res.status(201).json({
      token,
      userId: user.id,
      profileCompleted: user.profile_completed,
    });

  } catch (error) {
    console.error("🔥 Signup error caught:", error.message);
    res.status(500).json({ error: "Server error during signup" });
  }
};



// LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM patients WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const profileCompleted = user.profile_completed; // <-- fix this line

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      user: {
        ...userWithoutPassword,
        profileCompleted, // this will now be true after setup
      },
      token,
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// COMPLETE SETUP
exports.completeSetup = async (req, res) => {
  const userId = req.params.userId;
  const {
    last_menstrual_period,
    first_pregnancy,
    health_conditions,
    other_condition,
  } = req.body;

  const userIdInt = parseInt(userId);
  if (!userIdInt || isNaN(userIdInt)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (!last_menstrual_period) {
    return res.status(400).json({ error: 'Last menstrual period is required' });
  }

  try {
    const existingProfile = await pool.query(
      'SELECT * FROM pregnancy_profiles WHERE user_id = $1',
      [userIdInt]
    );

    if (existingProfile.rows.length > 0) {
      await pool.query(
        `UPDATE pregnancy_profiles 
         SET last_menstrual_period = $1, 
             first_pregnancy = $2, 
             health_conditions = $3, 
             other_condition = $4 
         WHERE user_id = $5`,
        [
          last_menstrual_period,
          first_pregnancy || false,
          health_conditions,
          other_condition,
          userIdInt,
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO pregnancy_profiles 
         (user_id, last_menstrual_period, first_pregnancy, health_conditions, other_condition) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          userIdInt,
          last_menstrual_period,
          first_pregnancy || false,
          health_conditions,
          other_condition,
        ]
      );
    }

    await pool.query(
      'UPDATE patients SET profile_completed = true WHERE id = $1',
      [userIdInt]
    );

    res.status(200).json({ message: 'Setup completed successfully' });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: 'Server error during setup' });
  }
};

// GET PROFILE (for home screen)
exports.getProfile = async (req, res) => {
  const { userId } = req.params;
  const userIdInt = parseInt(userId);

  if (!userIdInt || isNaN(userIdInt)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const result = await pool.query(
      `SELECT p.first_name, p.last_name, p.dob, 
              pp.last_menstrual_period, pp.first_pregnancy, 
              pp.health_conditions, pp.other_condition
       FROM patients p
       LEFT JOIN pregnancy_profiles pp ON p.id = pp.user_id
       WHERE p.id = $1`,
      [userIdInt]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error during profile fetch' });
  }
};

// SETUP PROFILE
exports.setupProfile = async (req, res) => {
  const { userId } = req.params;
  const { last_menstrual_period, first_pregnancy, health_conditions, other_condition } = req.body;

  try {
    // Save profile data (update as needed for your schema)
    await pool.query(
      `UPDATE patients SET 
        last_menstrual_period = $1,
        first_pregnancy = $2,
        health_conditions = $3,
        other_condition = $4,
        profile_completed = true
      WHERE id = $5`,
      [
        last_menstrual_period,
        first_pregnancy,
        JSON.stringify(health_conditions),
        other_condition,
        userId
      ]
    );

    res.status(200).json({ message: "Profile setup complete", profileCompleted: true });
  } catch (error) {
    console.error("Profile setup error:", error);
    res.status(500).json({ error: "Failed to complete profile setup" });
  }
};

// GET ALL PATIENTS
exports.getAllPatients = async (req, res) => {
  try {
    // Exclude sensitive info and optionally exclude the current user
    const patients = await pool.query(
      'SELECT id, first_name, last_name, email, profile_picture FROM patients'
    );

    // Format for frontend
    const users = patients.rows.map(p => ({
      id: p.id,
      name: `${p.first_name} ${p.last_name}`,
      avatar: p.profile_picture || null,
      email: p.email,
    }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};
