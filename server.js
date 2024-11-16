require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path'); // For working with file paths

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
  },
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// POST route for API submissions
app.post('/api/submit', async (req, res) => {
  try {
    const { email, country, state, city, manual_country, manual_city } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO early_access_submissions (email, country, state, city, manual_country, manual_city) VALUES (?, ?, ?, ?, ?, ?)',
      [email, country, state, city, manual_country, manual_city]
    );
    res.json({ success: true, message: 'Submission received. Thank you for your interest!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
