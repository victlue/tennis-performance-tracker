// client/src/components/NewMatchForm.js
import React, { useState } from 'react';
import API from '../api';

function NewMatchForm() {
  const [sets, setSets] = useState([
    { myGames: '', oppGames: '' },
    { myGames: '', oppGames: '' },
    { myGames: '', oppGames: '' },
  ]);

  const [didWin, setDidWin] = useState('false'); 
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(''); // date is now mandatory
  const [message, setMessage] = useState('');

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...sets];
    updatedSets[index][field] = value;
    setSets(updatedSets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      setMessage('Please select a date for this match.');
      return;
    }

    // Convert sets to numeric, remove empty ones
    const numericSets = sets
      .filter(s => s.myGames !== '' || s.oppGames !== '')
      .map(s => ({
        myGames: parseInt(s.myGames, 10) || 0,
        oppGames: parseInt(s.oppGames, 10) || 0,
      }));

    const matchData = {
      sets: numericSets,
      didWin: didWin === 'true',
      location,
      date,  // required
    };

    try {
      await API.post('/matches', matchData);
      setMessage('Match created successfully!');
      
      // Reset the form
      setSets([
        { myGames: '', oppGames: '' },
        { myGames: '', oppGames: '' },
        { myGames: '', oppGames: '' },
      ]);
      setDidWin('false');
      setLocation('');
      setDate('');
    } catch (error) {
      setMessage('Error creating match. Are you logged in?');
    }
  };

  return (
    <div>
      <h2>Add a New Match</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Sets (up to 3):</label>
        <table style={{ marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th>Set #</th>
              <th>My Games</th>
              <th>Opp’s Games</th>
            </tr>
          </thead>
          <tbody>
            {sets.map((set, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <input
                    type="number"
                    value={set.myGames}
                    onChange={(e) => handleSetChange(idx, 'myGames', e.target.value)}
                    style={{ width: '60px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={set.oppGames}
                    onChange={(e) => handleSetChange(idx, 'oppGames', e.target.value)}
                    style={{ width: '60px' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <label>Win or Loss? </label>
          <select value={didWin} onChange={(e) => setDidWin(e.target.value)}>
            <option value="false">Loss</option>
            <option value="true">Win</option>
          </select>
        </div>

        <div>
          <label>Location: </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label>Date (required): </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Match</button>
      </form>
    </div>
  );
}

export default NewMatchForm;
