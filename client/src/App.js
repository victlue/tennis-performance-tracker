// client/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

import './App.css';           // <-- new import
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import MatchList from './components/MatchList';
import NewMatchForm from './components/NewMatchForm';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <div className="navbar">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/matches">
          My Matches
        </NavLink>
        <NavLink to="/new-match">
          Add Match
        </NavLink>
        <NavLink to="/login">
          Login
        </NavLink>
        <NavLink to="/register">
          Register
        </NavLink>
      </div>

      {/* Main Content Area */}
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/matches" element={<MatchList />} />
          <Route path="/new-match" element={<NewMatchForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
