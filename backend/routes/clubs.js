const express = require('express');
const clubs = require('../controllers/clubs');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public
router.get('/clubs', clubs.getAllClubs);
router.get('/clubs/:id', clubs.getClubById);

// Admin only
router.post('/clubs', verifyToken, isAdmin, clubs.createClub);
router.put('/clubs/:id', verifyToken, isAdmin, clubs.updateClub);
router.delete('/clubs/:id', verifyToken, isAdmin, clubs.deleteClub);

// Logged-in users
router.post('/clubs/:id/join', verifyToken, clubs.joinClub);
router.delete('/clubs/:id/leave', verifyToken, clubs.leaveClub);
router.get('/my-clubs', verifyToken, clubs.getMyClubs);

module.exports = router;
