const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const clubRoutes = require('./routes/clubs');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

// All API routes start with /api
app.use('/api', authRoutes);
app.use('/api', clubRoutes);
app.use('/api', eventRoutes);
app.use('/api', userRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'CampusConnect API is running' });
});

// Unknown route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Express 5 sends errors from async controllers here
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
