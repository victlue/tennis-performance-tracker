// server/routes/stats.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Match = require('../models/Match');

// GET /api/stats/all
// Returns stats for ALL registered users
router.get('/all', async (req, res) => {
  try {
    // 1. Get all users
    const allUsers = await User.find({});

    // 2. For each user, load matches & compute stats
    const results = [];

    for (let user of allUsers) {
      const userMatches = await Match.find({ user: user._id });

      let totalWins = 0;
      let totalLosses = 0;
      let totalSetsWon = 0;
      let totalSetsLost = 0;
      let totalGamesWon = 0;
      let totalGamesLost = 0;

      userMatches.forEach((match) => {
        // W/L
        if (match.didWin) {
          totalWins += 1;
        } else {
          totalLosses += 1;
        }

        // Sets & Games
        if (Array.isArray(match.sets)) {
          match.sets.forEach((setObj) => {
            if (setObj.myGames > setObj.oppGames) {
              totalSetsWon += 1;
            } else if (setObj.myGames < setObj.oppGames) {
              totalSetsLost += 1;
            }
            totalGamesWon += setObj.myGames;
            totalGamesLost += setObj.oppGames;
          });
        }
      });

      results.push({
        _id: user._id,         // include the user’s ObjectId
        username: user.username,
        totalWins,
        totalLosses,
        totalSetsWon,
        totalSetsLost,
        totalGamesWon,
        totalGamesLost,
      });
    }

    // 3. Return the array
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
