const db = require('../config/db');

// GET /api/users (admin) - list all users without passwords
async function getAllUsers(req, res) {
  const [users] = await db.query(
    `SELECT u.id, u.name, u.email, u.role,
      (SELECT COUNT(*) FROM club_members m WHERE m.user_id = u.id) AS club_count,
      (SELECT COUNT(*) FROM registrations r WHERE r.user_id = u.id) AS event_count
     FROM users u ORDER BY u.id`
  );
  res.json(users);
}

// GET /api/registrations (admin) - who registered for which event
async function getAllRegistrations(req, res) {
  const [registrations] = await db.query(
    `SELECT r.id, r.registered_at, u.name AS user_name, u.email AS user_email,
       e.name AS event_name, e.date AS event_date, c.name AS club_name
     FROM registrations r
     JOIN users u ON r.user_id = u.id
     JOIN events e ON r.event_id = e.id
     JOIN clubs c ON e.club_id = c.id
     ORDER BY r.registered_at DESC, r.id DESC`
  );
  res.json(registrations);
}

module.exports = { getAllUsers, getAllRegistrations };
