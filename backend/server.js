const express = require('express');
const cors = require('cors');
require('dotenv').config();


const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const setupRoutes = require('./routes/setupRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const tipRoutes = require('./routes/tipRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/emergency', emergencyRoutes);

app.get('/', (req, res) => {
  res.send('🚀 PregCare API is up and running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
});