require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure the GEMINI_API_KEY is set
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in the environment variables!");
  process.exit(1);
}

console.log(`API Key: ${apiKey}`);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api', apiRoutes);

// Serve the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
