const express = require('express');
const { getAllUsers, getAllRegistrations } = require('../controllers/users');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/users', verifyToken, isAdmin, getAllUsers);
router.get('/registrations', verifyToken, isAdmin, getAllRegistrations);

module.exports = router;
