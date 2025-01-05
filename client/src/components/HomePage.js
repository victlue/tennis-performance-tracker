// client/src/components/HomePage.js
import React, { useEffect, useState } from 'react';
import API from '../api';

function HomePage() {
  const [allStats, setAllStats] = useState([]);
  const [userA, setUserA] = useState('');
  const [userB, setUserB] = useState('');
  const [probabilityResult, setProbabilityResult] = useState('');

  useEffect(() => {
    fetchAllStats();
    // eslint-disable-next-line
  }, []);

  const fetchAllStats = async () => {
    try {
      const res = await API.get('/stats/all');
      setAllStats(res.data);
    } catch (err) {
      console.error('Error fetching all user stats:', err);
    }
  };

  // Weighted approach: 75% from match ratio, 25% from games ratio
  const getUserScore = (user) => {
    let matchRatio = 0.5;
    let gamesRatio = 0.5;

    const totalMatches = user.totalWins + user.totalLosses;
    const totalGames = user.totalGamesWon + user.totalGamesLost;

    if (totalMatches > 0) {
      matchRatio = user.totalWins / totalMatches;
    }
    if (totalGames > 0) {
      gamesRatio = user.totalGamesWon / totalGames;
    }

    return 0.75 * matchRatio + 0.25 * gamesRatio;
  };

  const calculateMatchup = () => {
    if (!userA || !userB) {
      setProbabilityResult('Please select both players.');
      return;
    }
    if (userA === userB) {
      setProbabilityResult('Please select two different players.');
      return;
    }

    const playerA = allStats.find((u) => u._id === userA);
    const playerB = allStats.find((u) => u._id === userB);

    if (!playerA || !playerB) {
      setProbabilityResult('Invalid players selected.');
      return;
    }

    const scoreA = getUserScore(playerA);
    const scoreB = getUserScore(playerB);

    if (scoreA === 0 && scoreB === 0) {
      setProbabilityResult('Both players have no data, so it’s a 50-50 toss-up!');
      return;
    }

    const probA = scoreA / (scoreA + scoreB);
    const probAPercent = (probA * 100).toFixed(1);
    const probBPercent = (100 - probAPercent).toFixed(1);

    setProbabilityResult(
      `Percent win chances:\n${playerA.username} (~${probAPercent}%) vs. ${playerB.username} (~${probBPercent}%).`
    );
  };

  return (
    <div>
      <h2>Tennis Performance Tracker</h2>

      {/* Table of user stats */}
      <table border="1" cellPadding="8" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Matches (W-L)</th>
            <th>Sets (W-L)</th>
            <th>Games (W-L)</th>
          </tr>
        </thead>
        <tbody>
          {allStats.map((user, idx) => (
            <tr key={idx}>
              <td>{user.username}</td>
              <td>{user.totalWins}-{user.totalLosses}</td>
              <td>{user.totalSetsWon}-{user.totalSetsLost}</td>
              <td>{user.totalGamesWon}-{user.totalGamesLost}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Hypothetical Matchup Section */}
      <div style={{ marginTop: '2rem' }}>
        <h3>Hypothetical Matchup</h3>
        <p>Select two players to forecast the outcome of a head-to-head match.</p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>
            Player A:
            <select
              value={userA}
              onChange={(e) => setUserA(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value="">-- Select Player --</option>
              {allStats.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </label>

          <label style={{ marginRight: '1rem' }}>
            Player B:
            <select
              value={userB}
              onChange={(e) => setUserB(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value="">-- Select Player --</option>
              {allStats.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </label>

          <button onClick={calculateMatchup}>Calculate</button>
        </div>

        {probabilityResult && (
          <div
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              background: '#f7f7f7',
              maxWidth: '500px',
              whiteSpace: 'pre-line', // preserve line breaks in the string
            }}
          >
            <p>{probabilityResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
