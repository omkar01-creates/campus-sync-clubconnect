const db = require('../config/db');

// Common SELECT that also counts members and events of each club
const CLUB_SELECT = `
  SELECT c.*,
    (SELECT COUNT(*) FROM club_members m WHERE m.club_id = c.id) AS member_count,
    (SELECT COUNT(*) FROM events e WHERE e.club_id = c.id) AS event_count
  FROM clubs c`;

// GET /api/clubs
async function getAllClubs(req, res) {
  const [clubs] = await db.query(CLUB_SELECT + ' ORDER BY c.id');
  res.json(clubs);
}

// GET /api/clubs/:id
async function getClubById(req, res) {
  const [clubs] = await db.query(CLUB_SELECT + ' WHERE c.id = ?', [req.params.id]);
  if (clubs.length === 0) {
    return res.status(404).json({ message: 'Club not found' });
  }
  res.json(clubs[0]);
}

// POST /api/clubs (admin)
async function createClub(req, res) {
  const { name, description, category } = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: 'Club name and category are required' });
  }

  const [result] = await db.query(
    'INSERT INTO clubs (name, description, category) VALUES (?, ?, ?)',
    [name, description || '', category]
  );
  res.status(201).json({ message: 'Club added successfully', id: result.insertId });
}

// PUT /api/clubs/:id (admin)
async function updateClub(req, res) {
  const { name, description, category } = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: 'Club name and category are required' });
  }

  const [result] = await db.query(
    'UPDATE clubs SET name = ?, description = ?, category = ? WHERE id = ?',
    [name, description || '', category, req.params.id]
  );
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Club not found' });
  }
  res.json({ message: 'Club updated successfully' });
}

// DELETE /api/clubs/:id (admin) - its events and memberships are removed by ON DELETE CASCADE
async function deleteClub(req, res) {
  const [result] = await db.query('DELETE FROM clubs WHERE id = ?', [req.params.id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Club not found' });
  }
  res.json({ message: 'Club deleted successfully' });
}

// POST /api/clubs/:id/join
async function joinClub(req, res) {
  const clubId = req.params.id;
  const userId = req.user.id;

  const [clubs] = await db.query('SELECT id FROM clubs WHERE id = ?', [clubId]);
  if (clubs.length === 0) {
    return res.status(404).json({ message: 'Club not found' });
  }

  const [existing] = await db.query(
    'SELECT id FROM club_members WHERE user_id = ? AND club_id = ?',
    [userId, clubId]
  );
  if (existing.length > 0) {
    return res.status(400).json({ message: 'You have already joined this club' });
  }

  await db.query('INSERT INTO club_members (user_id, club_id) VALUES (?, ?)', [userId, clubId]);
  res.status(201).json({ message: 'You have joined the club' });
}

// DELETE /api/clubs/:id/leave
async function leaveClub(req, res) {
  const [result] = await db.query(
    'DELETE FROM club_members WHERE user_id = ? AND club_id = ?',
    [req.user.id, req.params.id]
  );
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'You are not a member of this club' });
  }
  res.json({ message: 'You have left the club' });
}

// GET /api/my-clubs - clubs joined by the logged-in user
async function getMyClubs(req, res) {
  const [clubs] = await db.query(
    `SELECT c.*, m.joined_at
     FROM club_members m
     JOIN clubs c ON m.club_id = c.id
     WHERE m.user_id = ?
     ORDER BY m.joined_at DESC`,
    [req.user.id]
  );
  res.json(clubs);
}

module.exports = {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  joinClub,
  leaveClub,
  getMyClubs
};
