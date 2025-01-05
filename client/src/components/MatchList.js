import React, { useEffect, useState } from 'react';
import API from '../api';

function MatchList() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  // We'll store computed stats in state
  const [stats, setStats] = useState({
    totalWins: 0,
    totalLosses: 0,
    totalSetsWon: 0,
    totalSetsLost: 0,
    totalGamesWon: 0,  // "points" if you treat each game as a point
    totalGamesLost: 0,
  });

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await API.get('/matches');
      setMatches(res.data);
      computeStats(res.data);
    } catch (err) {
      setError('Error fetching matches. Make sure you are logged in.');
    }
  };

  // Helper to compute overall stats from an array of matches
  const computeStats = (allMatches) => {
    let totalWins = 0;
    let totalLosses = 0;
    let totalSetsWon = 0;
    let totalSetsLost = 0;
    let totalGamesWon = 0;
    let totalGamesLost = 0;

    allMatches.forEach((match) => {
      if (match.didWin) {
        totalWins += 1;
      } else {
        totalLosses += 1;
      }

      if (match.sets && Array.isArray(match.sets)) {
        match.sets.forEach((setObj) => {
          const { myGames, oppGames } = setObj;
          // Count sets
          if (myGames > oppGames) {
            totalSetsWon += 1;
          } else if (myGames < oppGames) {
            totalSetsLost += 1;
          }
          // Count games (treat as "points")
          totalGamesWon += myGames;
          totalGamesLost += oppGames;
        });
      }
    });

    setStats({
      totalWins,
      totalLosses,
      totalSetsWon,
      totalSetsLost,
      totalGamesWon,
      totalGamesLost,
    });
  };

  // Handle match deletion
  const handleDelete = async (matchId) => {
    try {
      await API.delete(`/matches/${matchId}`);
      // Filter out the deleted match from state
      const updatedMatches = matches.filter((m) => m._id !== matchId);
      setMatches(updatedMatches);
      // Recompute stats after removal
      computeStats(updatedMatches);
    } catch (err) {
      setError('Error deleting match');
    }
  };

  return (
    <div>
      <h2>My Matches</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Overall Stats */}
      <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>Overall Stats</h3>
        <p>
          <strong>Match Record (W-L):</strong> {stats.totalWins}-{stats.totalLosses}
        </p>
        <p>
          <strong>Sets Record (W-L):</strong> {stats.totalSetsWon}-{stats.totalSetsLost}
        </p>
        <p>
          <strong>Games (Points) Record (W-L):</strong> {stats.totalGamesWon}-{stats.totalGamesLost}
        </p>
      </div>

      {/* Individual Matches */}
      <ul>
        {matches.map((match) => (
          <li key={match._id} style={{ marginBottom: '1rem' }}>
            <strong>Date:</strong> {new Date(match.date).toLocaleDateString()}<br />
            <strong>Win/Loss:</strong> {match.didWin ? 'Win' : 'Loss'}<br />
            <strong>Sets:</strong>
            <ul>
              {match.sets && match.sets.map((setObj, idx) => (
                <li key={idx}>
                  Set {idx + 1}: {setObj.myGames}-{setObj.oppGames}
                </li>
              ))}
            </ul>
            {match.location && (
              <>
                <strong>Location:</strong> {match.location}
                <br />
              </>
            )}

            {/* Delete button */}
            <button onClick={() => handleDelete(match._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MatchList;