const express = require('express');
const events = require('../controllers/events');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public
router.get('/events', events.getAllEvents);
router.get('/events/:id', events.getEventById);

// Admin only
router.post('/events', verifyToken, isAdmin, events.createEvent);
router.put('/events/:id', verifyToken, isAdmin, events.updateEvent);
router.delete('/events/:id', verifyToken, isAdmin, events.deleteEvent);

// Logged-in users
router.post('/events/:id/register', verifyToken, events.registerForEvent);
router.get('/my-events', verifyToken, events.getMyEvents);

module.exports = router;
