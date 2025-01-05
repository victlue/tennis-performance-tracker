// server/routes/matches.js
const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to check JWT
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ msg: 'No token provided' });
  }
  const token = header.split(' ')[1]; // "Bearer <token>"
  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // attach userId to req
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token is invalid or expired' });
  }
}

// CREATE a new match
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { sets, didWin, date, location } = req.body;
    const match = new Match({
      user: req.userId,
      sets,
      didWin,
      date,
      location
    });
    const savedMatch = await match.save();
    return res.status(201).json(savedMatch);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// READ (get) matches for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const matches = await Match.find({ user: req.userId }).sort({ date: -1 });
    return res.json(matches);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE a match by ID (only if the match belongs to the logged-in user)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const matchId = req.params.id;

    // Find match owned by the current user
    const match = await Match.findOne({ _id: matchId, user: req.userId });
    if (!match) {
      return res.status(404).json({ msg: 'Match not found or not owned by user' });
    }

    // Remove the match
    await match.deleteOne();
    return res.json({ msg: 'Match deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;