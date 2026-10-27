const db = require('../config/db');

// Common SELECT that adds the club name/category and registration count
const EVENT_SELECT = `
  SELECT e.*, c.name AS club_name, c.category AS club_category,
    (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) AS registration_count
  FROM events e
  JOIN clubs c ON e.club_id = c.id`;

// GET /api/events
async function getAllEvents(req, res) {
  const [events] = await db.query(EVENT_SELECT + ' ORDER BY e.date');
  res.json(events);
}

// GET /api/events/:id
async function getEventById(req, res) {
  const [events] = await db.query(EVENT_SELECT + ' WHERE e.id = ?', [req.params.id]);
  if (events.length === 0) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(events[0]);
}

// Checks required fields and that the club exists. Returns an error message or null.
async function validateEvent(body) {
  const { club_id, name, date, venue } = body;
  if (!club_id || !name || !date || !venue) {
    return 'Club, event name, date and venue are required';
  }
  const [clubs] = await db.query('SELECT id FROM clubs WHERE id = ?', [club_id]);
  if (clubs.length === 0) {
    return 'Selected club does not exist';
  }
  return null;
}

// POST /api/events (admin)
async function createEvent(req, res) {
  const error = await validateEvent(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const { club_id, name, description, date, venue } = req.body;
  const [result] = await db.query(
    'INSERT INTO events (club_id, name, description, date, venue) VALUES (?, ?, ?, ?, ?)',
    [club_id, name, description || '', date, venue]
  );
  res.status(201).json({ message: 'Event added successfully', id: result.insertId });
}

// PUT /api/events/:id (admin)
async function updateEvent(req, res) {
  const error = await validateEvent(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const { club_id, name, description, date, venue } = req.body;
  const [result] = await db.query(
    'UPDATE events SET club_id = ?, name = ?, description = ?, date = ?, venue = ? WHERE id = ?',
    [club_id, name, description || '', date, venue, req.params.id]
  );
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json({ message: 'Event updated successfully' });
}

// DELETE /api/events/:id (admin)
async function deleteEvent(req, res) {
  const [result] = await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json({ message: 'Event deleted successfully' });
}

// POST /api/events/:id/register
async function registerForEvent(req, res) {
  const eventId = req.params.id;
  const userId = req.user.id;

  const [events] = await db.query('SELECT id FROM events WHERE id = ?', [eventId]);
  if (events.length === 0) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const [existing] = await db.query(
    'SELECT id FROM registrations WHERE user_id = ? AND event_id = ?',
    [userId, eventId]
  );
  if (existing.length > 0) {
    return res.status(400).json({ message: 'You have already registered for this event' });
  }

  await db.query('INSERT INTO registrations (user_id, event_id) VALUES (?, ?)', [userId, eventId]);
  res.status(201).json({ message: 'Registered for the event successfully' });
}

// GET /api/my-events - events registered by the logged-in user
async function getMyEvents(req, res) {
  const [events] = await db.query(
    `SELECT e.*, c.name AS club_name, c.category AS club_category, r.registered_at
     FROM registrations r
     JOIN events e ON r.event_id = e.id
     JOIN clubs c ON e.club_id = c.id
     WHERE r.user_id = ?
     ORDER BY e.date`,
    [req.user.id]
  );
  res.json(events);
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getMyEvents
};
