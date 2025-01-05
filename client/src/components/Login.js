import React, { useState } from 'react';
import API from '../api';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      setMessage('Login successful!');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Username: </label>
          <input name="username" onChange={handleChange} value={form.username} />
        </div>
        <div>
          <label>Password: </label>
          <input name="password" type="password" onChange={handleChange} value={form.password} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
